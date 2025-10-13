import { renderHook, act } from '@testing-library/react';
import { useCartStore, useCartItemCount, useCartTotal } from '../use-cart.store';
import { Dish } from '@/lib/types';

const dishA: Dish = {
  id: 'a',
  category: 'Main',
  name: 'Dish A',
  image: '/a.jpg',
  description: 'A',
  price: 10,
  instock: 'yes',
  veg: 'veg',
};

const dishB: Dish = {
  id: 'b',
  category: 'Sides',
  name: 'Dish B',
  image: '/b.jpg',
  description: 'B',
  price: 5,
  instock: 'yes',
  veg: 'non-veg',
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
    expect(result.current.items[0].id).toBe('a');
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('removeItem removes the item entirely', () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(dishA);
      result.current.addItem(dishA);
      result.current.removeItem('a');
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('updateItemQuantity sets quantity and removes when <= 0', () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(dishA);
      result.current.updateItemQuantity('a', 5);
    });
    expect(result.current.items[0].quantity).toBe(5);

    act(() => {
      result.current.updateItemQuantity('a', 0);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('selectors: useCartItemCount returns number of distinct items', () => {
    const store = renderHook(() => useCartStore());
    const countHook = renderHook(() => useCartItemCount());

    act(() => {
      store.result.current.addItem(dishA);
      store.result.current.addItem(dishB);
    });

    expect(countHook.result.current).toBe(2);
  });

  it('selectors: useCartTotal returns total cost', () => {
    const store = renderHook(() => useCartStore());

    act(() => {
      store.result.current.addItem(dishA); // $10
      store.result.current.addItem(dishB); // $5
      store.result.current.updateItemQuantity('a', 3); // $30
      store.result.current.updateItemQuantity('b', 2); // $10
    });

    const totalHook = renderHook(() => useCartTotal());
    expect(totalHook.result.current).toBeCloseTo(40, 5);
  });
});