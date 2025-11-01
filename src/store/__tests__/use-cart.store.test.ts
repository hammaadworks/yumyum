import { renderHook, act } from '@testing-library/react';
import {
  useCartStore,
  useCartItemCount,
  useCartTotal,
} from '@/store/use-cart.store';
import { Dish } from '@/lib/types';

const dishA: Dish = {
  id: 1,
  brand_id: 1,
  category: 'Main',
  name: 'Dish A',
  image: '/a.jpg',
  description: 'A',
  price: 10,
  instock: 'yes',
  veg: 'veg',
  create_time: '',
  modify_time: '',
};

const dishB: Dish = {
  id: 2,
  brand_id: 1,
  category: 'Sides',
  name: 'Dish B',
  image: '/b.jpg',
  description: 'B',
  price: 5,
  instock: 'yes',
  veg: 'non-veg',
  create_time: '',
  modify_time: '',
};

describe('useCartStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  it('initializes with empty items', () => {
    const { result } = renderHook(() => useCartStore());
    expect(result.current.items).toEqual([]);
  });

  it('adds items and increments quantity when same item is added again', () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(dishA);
      result.current.addItem(dishA);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('removeItem removes the item entirely', () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(dishA);
      result.current.addItem(dishA);
      result.current.removeItem(1);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('updateItemQuantity sets quantity and removes when <= 0', () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(dishA);
      result.current.updateItemQuantity(1, 5);
    });
    expect(result.current.items[0].quantity).toBe(5);

    act(() => {
      result.current.updateItemQuantity(1, 0);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('selectors: useCartItemCount returns sum of all item quantities', () => {
    const store = renderHook(() => useCartStore());
    const countHook = renderHook(() => useCartItemCount());

    act(() => {
      store.result.current.addItem(dishA);
      store.result.current.addItem(dishA); // Add dishA twice to test quantity sum
      store.result.current.addItem(dishB);
    });

    expect(countHook.result.current).toBe(3); // 2 dishA + 1 dishB = 3 total items
  });

  it('selectors: useCartTotal returns total cost', () => {
    const store = renderHook(() => useCartStore());

    act(() => {
      store.result.current.addItem(dishA); // dishA: 1 x $10 = $10
      store.result.current.addItem(dishB); // dishB: 1 x $5 = $5
      store.result.current.updateItemQuantity(1, 3); // dishA: 3 x $10 = $30
      store.result.current.updateItemQuantity(2, 2); // dishB: 2 x $5 = $10
    });

    const totalHook = renderHook(() => useCartTotal());
    expect(totalHook.result.current).toBeCloseTo(40, 5);
  });
});
