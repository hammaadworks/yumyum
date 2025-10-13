import { create } from 'zustand';
import { Dish } from '@/lib/types';

// 1. Define the state and actions interfaces
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

// 2. Create the Zustand store
export const useCartStore = create<CartState>((set) => ({
  // 3. Initial state
  items: [],

  // 4. Actions
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        // If item exists, increment quantity
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      // If item doesn't exist, add it with quantity 1
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    })),

  updateItemQuantity: (itemId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
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

// 5. (Optional) Selectors for performance optimization
export const useCartItemCount = () => useCartStore((state) => state.items.length);
export const useCartTotal = () => useCartStore((state) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0)
);
