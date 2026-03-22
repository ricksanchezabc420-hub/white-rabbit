import { create } from 'zustand';

interface UIStore {
  isEntered: boolean;
  isCartOpen: boolean;
  setSiteEntered: (entered: boolean) => void;
  setCartOpen: (open: boolean) => void;
  toggleCart: (open?: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isEntered: false,
  isCartOpen: false,
  setSiteEntered: (entered) => set({ isEntered: entered }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  toggleCart: (open) => set((state) => ({ 
    isCartOpen: open !== undefined ? open : !state.isCartOpen 
  })),
}));
