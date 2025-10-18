import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ControlsBar } from '../controls-bar';
import { useFilterStore } from '@/store/use-filter.store';

// Mock the useFilterStore
jest.mock('@/store/use-filter.store');

describe('ControlsBar', () => {
  const mockToggleVegOnly = jest.fn();
  const mockToggleSortBy = jest.fn();
  const mockSetSearchQuery = jest.fn();

  beforeEach(() => {
    (useFilterStore as jest.Mock).mockReturnValue({
      vegOnly: false,
      sortBy: 'asc',
      searchQuery: '',
      toggleVegOnly: mockToggleVegOnly,
      toggleSortBy: mockToggleSortBy,
      setSearchQuery: mockSetSearchQuery,
    });
  });

  it('should render all controls', () => {
    render(<ControlsBar />);
    expect(screen.getByLabelText('Search menu')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle vegetable only filter')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort by price, currently Low to High')).toBeInTheDocument();
  });

  it('should call toggleVegOnly when the switch is clicked', () => {
    render(<ControlsBar />);
    fireEvent.click(screen.getByLabelText('Toggle vegetable only filter'));
    expect(mockToggleVegOnly).toHaveBeenCalled();
  });

  it('should call toggleSortBy when the sort button is clicked', () => {
    render(<ControlsBar />);
    fireEvent.click(screen.getByLabelText('Sort by price, currently Low to High'));
    expect(mockToggleSortBy).toHaveBeenCalled();
  });

  it('should call setSearchQuery when the search input changes', async () => {
    render(<ControlsBar />);
    fireEvent.change(screen.getByLabelText('Search menu'), { target: { value: 'test' } });
    // Wait for debounced call
    await waitFor(
      () => {
        expect(mockSetSearchQuery).toHaveBeenCalledWith('test');
      },
      { timeout: 500 }
    );
  });
});
