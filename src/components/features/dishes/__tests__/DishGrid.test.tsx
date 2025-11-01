import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DishGrid } from '@/components/features/dishes/DishGrid';
import { FilterState, useFilterStore } from '@/store/use-filter.store';
import { UIState, useUIStore } from '@/store/use-ui.store';
import { MOCK_DISHES } from '@/lib/mock-data';

// Define mock types for the Zustand stores
type MockFilterStore = typeof useFilterStore;
type MockUIStore = typeof useUIStore;

// Mock the entire modules for the Zustand stores
jest.mock('@/store/use-filter.store', () => ({
  useFilterStore: jest.fn(),
}));
jest.mock('@/store/use-ui.store', () => ({
  useUIStore: jest.fn(),
}));

describe('DishGrid Component', () => {
  let mockFilterStoreState: FilterState;
  let mockUIStoreState: UIState;

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
      currentReelDishId: null,
      activeIndex: 0,
      setActiveIndex: jest.fn(),
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
      isImageViewerOpen: false,
      imageViewerSrc: '',
      openImageViewer: jest.fn(),
      closeImageViewer: jest.fn(),
    };

    // Set the mock implementation for the hooks
    (
      useFilterStore as unknown as jest.MockedFunction<MockFilterStore>
    ).mockImplementation(() => mockFilterStoreState);
    (
      useUIStore as unknown as jest.MockedFunction<MockUIStore>
    ).mockImplementation(() => mockUIStoreState);
  });

  // Test Case: 1.6-G-01 - should render all dishes sorted by price ascending by default
  it('should render all dishes sorted by price ascending by default', () => {
    render(<DishGrid dishes={MOCK_DISHES} onDishSelect={() => {}} />);
    const dishNames = screen
      .getAllByTestId('dish-card')
      .map((card) => card.getAttribute('data-dish-name'));
    expect(dishNames).toEqual([
      'Pepperoni Pizza',
      'Veggie Burger',
      'Chicken Burger',
      'Margherita Pizza',
    ]);
  });

  // Test Case: 1.6-G-02 - should filter for veg dishes only
  it('should filter for veg dishes only', () => {
    mockFilterStoreState.vegOnly = true;
    render(<DishGrid dishes={MOCK_DISHES} onDishSelect={() => {}} />);
    const dishNames = screen
      .getAllByTestId('dish-card')
      .map((card) => card.getAttribute('data-dish-name'));
    expect(dishNames).toEqual(['Veggie Burger', 'Margherita Pizza']);
  });

  // Test Case: 1.6-G-03 - should sort dishes by price descending
  it('should sort dishes by price descending', () => {
    mockFilterStoreState.sortBy = 'desc';
    render(<DishGrid dishes={MOCK_DISHES} onDishSelect={() => {}} />);
    const dishNames = screen
      .getAllByTestId('dish-card')
      .map((card) => card.getAttribute('data-dish-name'));
    expect(dishNames).toEqual([
      'Margherita Pizza',
      'Chicken Burger',
      'Veggie Burger',
      'Pepperoni Pizza',
    ]);
  });

  // Test Case: 1.6-G-04 - should filter and sort simultaneously
  it('should filter and sort simultaneously', () => {
    mockFilterStoreState.vegOnly = true;
    mockFilterStoreState.sortBy = 'desc';
    render(<DishGrid dishes={MOCK_DISHES} onDishSelect={() => {}} />);
    const dishNames = screen
      .getAllByTestId('dish-card')
      .map((card) => card.getAttribute('data-dish-name'));
    expect(dishNames).toEqual(['Margherita Pizza', 'Veggie Burger']);
  });

  it('should filter by search query', () => {
    mockFilterStoreState.searchQuery = 'chicken';
    render(<DishGrid dishes={MOCK_DISHES} onDishSelect={() => {}} />);
    const dishNames = screen
      .getAllByTestId('dish-card')
      .map((card) => card.getAttribute('data-dish-name'));
    expect(dishNames).toEqual(['Chicken Burger']);
  });
});
