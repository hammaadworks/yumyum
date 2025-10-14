import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReelView } from '@/components/features/reel/reel-view';
import { useUIStore } from '@/store/use-ui.store';
import { Dish } from '@/lib/types';

const MOCK_DISHES: Dish[] = [
  { id: '1', name: 'In Stock Dish', category: 'A', price: 10, veg: 'veg', image: 'a.png', description: '', instock: 'yes' },
  { id: '2', name: 'Out of Stock Dish', category: 'B', price: 12, veg: 'non-veg', image: 'b.png', description: '', instock: 'no' },
  { id: '3', name: 'Another In Stock', category: 'C', price: 15, veg: 'veg', image: 'c.png', description: '', instock: 'yes' },
];

// Mock child components
jest.mock('@/components/shared/global-cart', () => ({
  GlobalCart: () => <div data-testid="global-cart" />,
}));
jest.mock('@/components/features/reel/reel-action-bar', () => ({
  ReelActionBar: () => <div data-testid="reel-action-bar" />,
}));
jest.mock('@/components/features/reel/reel-category-navigator', () => ({
    ReelCategoryNavigator: () => <div data-testid="reel-category-navigator" />,
}));

const initialState = useUIStore.getState();

describe('ReelView Component', () => {
  beforeEach(() => {
    useUIStore.setState(initialState);
  });

  // Test Case: 2.1-R-01 (combined with 2.1-R-02)
  it('should not be visible by default and appear when store state is updated', () => {
    const { rerender } = render(<ReelView dishes={MOCK_DISHES} />);
    expect(screen.queryByTestId('reel-view-container')).not.toBeInTheDocument();

    act(() => {
      useUIStore.getState().openReelView();
    });

    rerender(<ReelView dishes={MOCK_DISHES} />);
    expect(screen.getByTestId('reel-view-container')).toBeInTheDocument();
  });

  // Test Case: 2.1-L-01
  it('should render out-of-stock dishes last', () => {
    act(() => {
      useUIStore.getState().openReelView();
    });
    render(<ReelView dishes={MOCK_DISHES} />);

    const dishItems = screen.getAllByTestId('dish-item');
    const lastDish = dishItems[dishItems.length - 1];
    const nameElement = lastDish.querySelector('h2');
    expect(nameElement).not.toBeNull();
    expect(nameElement?.textContent).toBe('Out of Stock Dish');
  });

  // Test Case: 2.1-C-01
  it('should close when the close button is clicked', async () => {
    act(() => {
      useUIStore.getState().openReelView();
    });

    render(<ReelView dishes={MOCK_DISHES} />);
    expect(screen.getByTestId('reel-view-container')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/close/i));

    await waitFor(() => {
      expect(screen.queryByTestId('reel-view-container')).not.toBeInTheDocument();
    });
    expect(useUIStore.getState().isReelViewOpen).toBe(false);
  });

  // Test Case: 2.1-R-03
  it('should render the GlobalCart component', () => {
    act(() => {
      useUIStore.getState().openReelView();
    });
    render(<ReelView dishes={MOCK_DISHES} />);
    expect(screen.getByTestId('global-cart')).toBeInTheDocument();
  });
});