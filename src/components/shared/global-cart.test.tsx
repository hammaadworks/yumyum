import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GlobalCart } from './global-cart';
import { useCartItemCount } from '@/store/use-cart.store';
import { useUIStore } from '@/store/use-ui.store';

// Mock the stores
jest.mock('@/store/use-cart.store');
jest.mock('@/store/use-ui.store');

describe('GlobalCart', () => {
  const mockOpenCartSummary = jest.fn();

  beforeEach(() => {
    (useUIStore as jest.Mock).mockReturnValue({
      openCartSummary: mockOpenCartSummary,
    });
  });

  it('should render the cart icon', () => {
    (useCartItemCount as jest.Mock).mockReturnValue(0);
    render(<GlobalCart />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should not display the badge when the cart is empty', () => {
    (useCartItemCount as jest.Mock).mockReturnValue(0);
    render(<GlobalCart />);
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
  });

  it('should display the badge with the correct item count', () => {
    (useCartItemCount as jest.Mock).mockReturnValue(5);
    render(<GlobalCart />);
    const badge = screen.getByTestId('cart-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('5');
  });

  it('should call openCartSummary when the button is clicked', () => {
    (useCartItemCount as jest.Mock).mockReturnValue(0);
    render(<GlobalCart />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOpenCartSummary).toHaveBeenCalled();
  });
});
