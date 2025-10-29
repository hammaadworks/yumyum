import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ControlsBar } from '@/components/shared/ControlsBar';
import { useFilterStore } from '@/store/use-filter.store';
import { FilterState } from '@/store/use-filter.store';

// Define mock type for the Zustand store
type MockFilterStore = typeof useFilterStore;

// Mock the entire module for Zustand store
jest.mock('@/store/use-filter.store', () => ({
  useFilterStore: jest.fn(),
}));

describe('ControlsBar', () => {
  let mockFilterStoreState: FilterState;
  const mockToggleVegOnly = jest.fn();
  const mockToggleSortBy = jest.fn();
  const mockSetSearchQuery = jest.fn();

  beforeEach(() => {
    mockFilterStoreState = {
      vegOnly: false,
      sortBy: 'asc',
      searchQuery: '',
      toggleVegOnly: mockToggleVegOnly,
      toggleSortBy: mockToggleSortBy,
      setSearchQuery: mockSetSearchQuery,
    };
    // Set the mock implementation for the hook
    (
      useFilterStore as unknown as jest.MockedFunction<MockFilterStore>
    ).mockImplementation(() => mockFilterStoreState);
  });

  it('should render all controls', () => {
    render(<ControlsBar />);
    expect(screen.getByLabelText('Search menu')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Toggle vegetable only filter'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Sort by price, currently Low to High'),
    ).toBeInTheDocument();
  });

  it('should call toggleVegOnly when the switch is clicked', () => {
    render(<ControlsBar />);
    fireEvent.click(screen.getByLabelText('Toggle vegetable only filter'));
    expect(mockToggleVegOnly).toHaveBeenCalled();
  });

  it('should call toggleSortBy when the sort button is clicked', () => {
    render(<ControlsBar />);
    fireEvent.click(
      screen.getByLabelText('Sort by price, currently Low to High'),
    );
    expect(mockToggleSortBy).toHaveBeenCalled();
  });

  it('should call setSearchQuery when the search input changes', async () => {
    render(<ControlsBar />);
    fireEvent.change(screen.getByLabelText('Search menu'), {
      target: { value: 'test' },
    });
    // Wait for debounced call
    await waitFor(
      () => {
        expect(mockSetSearchQuery).toHaveBeenCalledWith('test');
      },
      { timeout: 500 },
    );
  });
});
