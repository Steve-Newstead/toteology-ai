
import { create } from 'zustand';
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
