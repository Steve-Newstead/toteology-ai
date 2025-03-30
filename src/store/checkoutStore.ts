
import { create } from 'zustand';
import { toast } from 'sonner';
import { placeOrder, getShippingRates } from '@/services/printifyService';
import { processPayment, createCheckoutSession, redirectToCheckout } from '@/services/stripeService';
import { useCartStore } from './cartStore';
import { useToteStore } from './toteStore';

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
      // Process payment with Stripe
      const result = await processPayment(paymentMethodId, amount, email);
      return result;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    } finally {
      set({ isProcessing: false });
    }
  },
  createCheckoutSession: async (items, email) => {
    set({ isProcessing: true });
    try {
      // Create a checkout session with Stripe
      const session = await createCheckoutSession(items, email);
      
      // In a real implementation, we would redirect to Stripe's checkout page
      const result = await redirectToCheckout(session.id);
      
      if (result.success) {
        // For the mock implementation, we'll simulate a successful checkout
        set({ step: 'confirmation' });
      }
      
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    } finally {
      set({ isProcessing: false });
    }
  },
  placeOrder: async () => {
    const state = get();
    const cartStore = useCartStore.getState();
    
    if (!state.shippingInfo.address) {
      toast.error("Please complete all required shipping information");
      return;
    }
    
    set({ isProcessing: true });
    
    try {
      // Get first cart item for order
      const cartItem = cartStore.items[0];
      
      if (!cartItem) {
        toast.error("Your cart is empty");
        set({ isProcessing: false });
        return;
      }
      
      // Process the order with Printify service
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
        
        // Only clear cart when the user confirms the order is complete
        // cartStore.clearCart();
        
        toast.success("Order placed successfully!");
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
