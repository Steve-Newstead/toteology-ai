
import { create } from 'zustand';

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
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  clearCart: () => set({ items: [] }),
  totalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));

<lov-add-dependency>zustand@4.4.5</lov-add-dependency>
