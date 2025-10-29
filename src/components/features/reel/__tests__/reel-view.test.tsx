import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReelView } from '@/components/features/reel/ReelView';
import { useUIStore } from '@/store/use-ui.store';
import { Dish } from '@/lib/types';

const MOCK_DISHES: Dish[] = [
  {
    id: '1',
    name: 'In Stock Dish',
    category: 'A',
    price: 10,
    veg: 'veg',
    image: 'https://example.com/a.png',
    description: '',
    instock: 'yes',
  },
  {
    id: '2',
    name: 'Out of Stock Dish',
    category: 'B',
    price: 12,
    veg: 'non-veg',
    image: 'https://example.com/b.png',
    description: '',
    instock: 'no',
  },
  {
    id: '3',
    name: 'Another In Stock',
    category: 'C',
    price: 15,
    veg: 'veg',
    image: 'https://example.com/c.png',
    description: '',
    instock: 'yes',
  },
];

const mockCategories = ['A', 'B', 'C'];
const mockActiveIndex = 0;
const mockCloseReelView = jest.fn();
const mockSetActiveIndex = jest.fn();

// Mock child components
jest.mock('@/components/shared/GlobalCart', () => ({
  GlobalCart: () => <div data-testid="global-cart" />,
}));
jest.mock('@/components/features/reel/ReelActionBar', () => ({
  ReelActionBar: () => <div data-testid="reel-action-bar" />,
}));
jest.mock('@/components/features/reel/ReelCategoryNavigator', () => ({
  ReelCategoryNavigator: () => <div data-testid="reel-category-navigator" />,
}));

const initialState = useUIStore.getState();

describe('ReelView Component', () => {
  beforeEach(() => {
    useUIStore.setState(initialState);
  });

  // Test Case: 2.1-R-01 (combined with 2.1-R-02)
  it('should not be visible by default and appear when store state is updated', async () => {
    const { rerender } = render(
      <ReelView
        dishes={MOCK_DISHES}
        categories={mockCategories}
        activeIndex={mockActiveIndex}
        isReelViewOpen={false}
        closeReelView={mockCloseReelView}
        setActiveIndex={mockSetActiveIndex}
      />,
    );
    expect(screen.queryByTestId('reel-view-container')).not.toBeInTheDocument(); // Initially not in DOM

    await act(async () => {
      useUIStore.getState().openReelView();
    });

    rerender(
      <ReelView
        dishes={MOCK_DISHES}
        categories={mockCategories}
        activeIndex={mockActiveIndex}
        isReelViewOpen={true}
        closeReelView={mockCloseReelView}
        setActiveIndex={mockSetActiveIndex}
      />,
    );
    expect(screen.getByTestId('reel-view-container')).toBeInTheDocument();
  });

  // Test Case: 2.1-L-01
  it('should render the correct dish name for the last dish', () => {
    render(
      <ReelView
        dishes={MOCK_DISHES}
        categories={mockCategories}
        activeIndex={mockActiveIndex}
        isReelViewOpen={true}
        closeReelView={mockCloseReelView}
        setActiveIndex={mockSetActiveIndex}
      />,
    );

    const dishItems = screen.getAllByTestId('dish-item');
    const lastDish = dishItems[dishItems.length - 1];
    const nameElement = lastDish.querySelector('h2');
    expect(nameElement).not.toBeNull();
    expect(nameElement?.textContent).toBe('Out of Stock Dish');
  });

  // Test Case: 2.1-C-01
  it('should close when the close button is clicked', async () => {
    render(
      <ReelView
        dishes={MOCK_DISHES}
        categories={mockCategories}
        activeIndex={mockActiveIndex}
        isReelViewOpen={true}
        closeReelView={mockCloseReelView}
        setActiveIndex={mockSetActiveIndex}
      />,
    );
    expect(screen.getByTestId('reel-view-container')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/close/i));

    await waitFor(() => {
      expect(screen.queryByTestId('reel-view-container')).toHaveStyle(
        'opacity: 0',
      );
    });
    expect(mockCloseReelView).toHaveBeenCalled();
  });

  // Test Case: 2.1-R-03
  // it('should render the GlobalCart component', () => {
  //   render(<ReelView dishes={MOCK_DISHES} categories={mockCategories} activeIndex={mockActiveIndex} isReelViewOpen={true} closeReelView={mockCloseReelView} setActiveIndex={mockSetActiveIndex} />);
  //   expect(screen.getByTestId('global-cart')).toBeInTheDocument();
  // });
});
