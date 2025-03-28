
import { create } from 'zustand';
import { toast } from 'sonner';

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

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
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
