import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  theme: string; // Tailwind class
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartTotalCAD: () => number;
}

const USDC_TO_CAD = 1.35; // Semi-regularly updated relative cost rate

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(i => i.id === item.id);
          if (existing) {
            return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({ items: state.items.filter(i => i.id !== id) }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: quantity > 0 
            ? state.items.map(i => i.id === id ? { ...i, quantity } : i)
            : state.items.filter(i => i.id !== id)
        }));
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
      getCartTotalCAD: () => get().getCartTotal() * USDC_TO_CAD,
    }),
    {
      name: 'white-rabbit-cart',
    }
  )
);
