import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DishGrid } from '../DishGrid';
import { useFilterStore } from '@/store/use-filter.store';
import { useUIStore } from '@/store/use-ui.store';
import { Dish } from '@/lib/types';

// Define mock types for the Zustand stores
type MockFilterStore = typeof useFilterStore;
type MockUIStore = typeof useUIStore;

// Mock the entire modules for Zustand stores
jest.mock('@/store/use-filter.store', () => ({
  useFilterStore: jest.fn(),
}));
jest.mock('@/store/use-ui.store', () => ({
  useUIStore: jest.fn(),
}));

const mockDishes: Dish[] = [
  { id: '1', name: 'Veg Dish', description: 'A delicious veg dish', price: 10, category: 'Main', image: 'https://via.placeholder.com/150', instock: 'yes', veg: 'veg' },
  { id: '2', name: 'Non-Veg Dish', description: 'A delicious non-veg dish', price: 15, category: 'Main', image: 'https://via.placeholder.com/150', instock: 'yes', veg: 'non-veg' },
  { id: '3', name: 'Another Veg Dish', description: 'Another tasty veg option', price: 5, category: 'Starter', image: 'https://via.placeholder.com/150', instock: 'yes', veg: 'veg' },
];

describe('DishGrid', () => {
  let mockFilterStoreState: any;
  let mockUIStoreState: any;

  beforeEach(() => {
    mockFilterStoreState = {
      vegOnly: false,
      sortBy: 'asc',
      searchQuery: '',
      toggleVegOnly: jest.fn(),
      toggleSortBy: jest.fn(),
      setSearchQuery: jest.fn(),
    };
    mockUIStoreState = {
      isReelViewOpen: false,
      openReelView: jest.fn(),
      closeReelView: jest.fn(),
      activeDishId: null,
      setActiveDishId: jest.fn(),
      isCartSummaryOpen: false,
      openCartSummary: jest.fn(),
      closeCartSummary: jest.fn(),
      isFeedbackViewOpen: false,
      openFeedbackView: jest.fn(),
      closeFeedbackView: jest.fn(),
      isStatusViewerOpen: false,
      openStatusViewer: jest.fn(),
      closeStatusViewer: jest.fn(),
      isQRCodeModalOpen: false,
      openQRCodeModal: jest.fn(),
      closeQRCodeModal: jest.fn(),
    };

    // Set the mock implementation for the hooks
    (useFilterStore as unknown as jest.MockedFunction<MockFilterStore>).mockImplementation(() => mockFilterStoreState);
    (useUIStore as unknown as jest.MockedFunction<MockUIStore>).mockImplementation(() => mockUIStoreState);
  });

  it('should render all dishes by default', () => {
    render(<DishGrid dishes={mockDishes} />);
    expect(screen.getByText('Veg Dish')).toBeInTheDocument();
    expect(screen.getByText('Non-Veg Dish')).toBeInTheDocument();
    expect(screen.getByText('Another Veg Dish')).toBeInTheDocument();
  });

  it('should filter for veg dishes only', () => {
    mockFilterStoreState.vegOnly = true; // Directly modify the mock state
    render(<DishGrid dishes={mockDishes} />);
    expect(screen.getByText('Veg Dish')).toBeInTheDocument();
    expect(screen.queryByText('Non-Veg Dish')).not.toBeInTheDocument();
    expect(screen.getByText('Another Veg Dish')).toBeInTheDocument();
  });

  it('should sort dishes by price ascending', () => {
    mockFilterStoreState.sortBy = 'asc'; // Directly modify the mock state
    const { getAllByRole } = render(<DishGrid dishes={mockDishes} />);
    const dishNames = getAllByRole('heading').map(h => h.textContent);
    expect(dishNames).toEqual(['Another Veg Dish', 'Veg Dish', 'Non-Veg Dish']);
  });

  it('should sort dishes by price descending', () => {
    mockFilterStoreState.sortBy = 'desc'; // Directly modify the mock state
    const { getAllByRole } = render(<DishGrid dishes={mockDishes} />);
    const dishNames = getAllByRole('heading').map(h => h.textContent);
    expect(dishNames).toEqual(['Non-Veg Dish', 'Veg Dish', 'Another Veg Dish']);
  });

  it('should filter by search query', () => {
    mockFilterStoreState.searchQuery = 'non-veg'; // Directly modify the mock state
    render(<DishGrid dishes={mockDishes} />);
    expect(screen.queryByText('Veg Dish')).not.toBeInTheDocument();
    expect(screen.getByText('Non-Veg Dish')).toBeInTheDocument();
    expect(screen.queryByText('Another Veg Dish')).not.toBeInTheDocument();
  });
});
