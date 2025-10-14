import { create } from 'zustand';
import { Dish } from '@/lib/types';

interface CartItem extends Dish {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Dish) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    })),
  updateItemQuantity: (itemId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.id !== itemId) };
      }
      return {
        items: state.items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        ),
      };
    }),
  clearCart: () => set({ items: [] }),
}));

// Selectors
export const useCartItemCount = () => useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
export const useCartTotal = () => useCartStore((state) => state.items.reduce((acc, item) => acc + item.price * item.quantity, 0));