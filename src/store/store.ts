import { create } from 'zustand';
import { placeOrder, getShippingRates } from '@/services/printifyService';
import { processPayment, createCheckoutSession, redirectToCheckout } from '@/services/stripeService';
import { toast } from 'sonner';

interface ToteState {
  prompt: string;
  logoUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  setPrompt: (prompt: string) => void;
  setLogoUrl: (url: string | null) => void;
  generateLogo: (prompt: string) => Promise<void>;
  resetError: () => void;
}

export const useToteStore = create<ToteState>((set) => ({
  prompt: '',
  logoUrl: null,
  isGenerating: false,
  error: null,
  setPrompt: (prompt) => set({ prompt }),
  setLogoUrl: (logoUrl) => set({ logoUrl }),
  generateLogo: async (prompt) => {
    set({ isGenerating: true, error: null });
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll use a placeholder image
      // In a real implementation, this would call an AI image generation API
      const mockLogoUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/400`;
      
      set({ logoUrl: mockLogoUrl, isGenerating: false });
    } catch (error) {
      console.error('Error generating logo:', error);
      set({ 
        error: 'Failed to generate logo. Please try again.', 
        isGenerating: false 
      });
    }
  },
  resetError: () => set({ error: null }),
}));

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  logoPrompt: string;
  variantId?: string;
  variantName?: string;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { items: [...state.items, item] };
    });
    
    toast.success(`${item.name} added to cart!`);
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
    
    toast.info("Item removed from cart");
  },
  clearCart: () => set({ items: [] }),
  totalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));

interface CheckoutState {
  step: 'shipping' | 'payment' | 'review' | 'confirmation';
  shippingInfo: {
    address: {
      name: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    } | null;
    method: string;
    price: number;
  };
  billingInfo: {
    sameAsShipping: boolean;
    address: {
      name: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    } | null;
    paymentMethod: {
      type: 'credit_card' | 'paypal';
      cardNumber?: string;
      cardExpiry?: string;
      cardCvc?: string;
    } | null;
  };
  orderId: string | null;
  isProcessing: boolean;
  setStep: (step: 'shipping' | 'payment' | 'review' | 'confirmation') => void;
  setShippingInfo: (info: Partial<CheckoutState['shippingInfo']>) => void;
  setBillingInfo: (info: Partial<CheckoutState['billingInfo']>) => void;
  processPayment: (paymentMethodId: string, amount: number, email: string) => Promise<any>;
  createCheckoutSession: (items: any[], email: string) => Promise<any>;
  placeOrder: () => Promise<void>;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  step: 'shipping',
  shippingInfo: {
    address: null,
    method: '',
    price: 0,
  },
  billingInfo: {
    sameAsShipping: true,
    address: null,
    paymentMethod: null,
  },
  orderId: null,
  isProcessing: false,
  setStep: (step) => set({ step }),
  setShippingInfo: (info) => set((state) => ({
    shippingInfo: { ...state.shippingInfo, ...info }
  })),
  setBillingInfo: (info) => set((state) => ({
    billingInfo: { ...state.billingInfo, ...info }
  })),
  processPayment: async (paymentMethodId, amount, email) => {
    set({ isProcessing: true });
    try {
      // Use the Stripe service to process payment
      const result = await processPayment(paymentMethodId, amount, email);
      set({ isProcessing: false });
      return result;
    } catch (error) {
      set({ isProcessing: false });
      throw error;
    }
  },
  createCheckoutSession: async (items, email) => {
    set({ isProcessing: true });
    try {
      // Create a checkout session with Stripe
      const session = await createCheckoutSession(items, email);
      set({ isProcessing: false });
      return session;
    } catch (error) {
      set({ isProcessing: false });
      throw error;
    }
  },
  placeOrder: async () => {
    const state = get();
    const cartStore = useCartStore.getState();
    const toteStore = useToteStore.getState();
    
    if (!state.shippingInfo.address || !state.billingInfo.paymentMethod) {
      toast.error("Please complete all required information");
      return;
    }
    
    set({ isProcessing: true });
    
    try {
      // Get first cart item for demo
      const cartItem = cartStore.items[0];
      
      if (!cartItem) {
        toast.error("Your cart is empty");
        set({ isProcessing: false });
        return;
      }
      
      // Call Printify mock service for order processing
      const result = await placeOrder({
        product: {
          id: "tote-bag-standard",
          variants: [{ id: cartItem.variantId || "tote-bag-standard-natural" }]
        },
        designUrl: cartItem.imageUrl,
        shippingInfo: state.shippingInfo,
        billingInfo: state.billingInfo,
      });
      
      if (result.success) {
        set({ 
          orderId: result.success && 'orderId' in result ? result.orderId : null,
          step: 'confirmation',
          isProcessing: false,
        });
        cartStore.clearCart();
      } else {
        toast.error("There was a problem placing your order");
        set({ isProcessing: false });
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("An unexpected error occurred");
      set({ isProcessing: false });
    }
  },
  reset: () => set({
    step: 'shipping',
    shippingInfo: {
      address: null,
      method: '',
      price: 0,
    },
    billingInfo: {
      sameAsShipping: true,
      address: null,
      paymentMethod: null,
    },
    orderId: null,
    isProcessing: false,
  }),
}));
