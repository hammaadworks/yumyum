'use client';

import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GlobalCart } from './global-cart';
import { useCartStore } from '@/store/use-cart.store';
import { mockDish } from '@/lib/mock-data';

describe('GlobalCart', () => {
  const initialStoreState = useCartStore.getState();

  beforeEach(() => {
    useCartStore.setState(initialStoreState);
  });

  it('renders without crashing', () => {
    render(<GlobalCart />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('hides the badge when the cart is empty', () => {
    render(<GlobalCart />);
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
  });

  it('displays the correct item count when the cart is not empty', () => {
    const dish1 = { ...mockDish, id: '1', name: 'Dish 1' };
    const dish2 = { ...mockDish, id: '2', name: 'Dish 2' };

    act(() => {
      useCartStore.getState().addItem(dish1);
      useCartStore.getState().addItem(dish2);
      useCartStore.getState().addItem(dish1); // Add one more of dish1
    });

    render(<GlobalCart />);

    // Total quantity should be 3 (2 of dish1, 1 of dish2)
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls the click handler when clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<GlobalCart />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith('Cart clicked. Items:', []);
    consoleSpy.mockRestore();
  });

  it('has the correct aria-label', () => {
    act(() => {
      useCartStore.getState().addItem({ ...mockDish, id: '1' });
    });
    render(<GlobalCart />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'View cart, 1 items');
  });
});

