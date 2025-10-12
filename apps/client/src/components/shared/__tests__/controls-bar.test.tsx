import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ControlsBar } from '@/components/shared/controls-bar';
import { useFilterStore } from '@/store/use-filter.store';
import { act } from 'react';

// Mock the store
const originalState = useFilterStore.getState();

describe('ControlsBar', () => {
  beforeEach(() => {
    act(() => {
      useFilterStore.setState(originalState);
    });
  });

  it('should toggle "Veg Only" state when switch is clicked', () => {
    render(<ControlsBar />);
    const vegSwitch = screen.getByLabelText(/Veg Only/i);

    expect(useFilterStore.getState().isVegOnly).toBe(false);

    fireEvent.click(vegSwitch);
    expect(useFilterStore.getState().isVegOnly).toBe(true);

    fireEvent.click(vegSwitch);
    expect(useFilterStore.getState().isVegOnly).toBe(false);
  });

  it('should toggle sort order when button is clicked', () => {
    render(<ControlsBar />);
    const sortButton = screen.getByText(/Price: Low to High/i);

    expect(useFilterStore.getState().sortOrder).toBe('asc');

    fireEvent.click(sortButton);
    expect(useFilterStore.getState().sortOrder).toBe('desc');
    expect(screen.getByText(/Price: High to Low/i)).toBeInTheDocument();

    fireEvent.click(sortButton);
    expect(useFilterStore.getState().sortOrder).toBe('asc');
    expect(screen.getByText(/Price: Low to High/i)).toBeInTheDocument();
  });

  it('should update search query when user types in the input', () => {
    render(<ControlsBar />);
    const searchInput = screen.getByPlaceholderText(/Search menu.../i);

    expect(useFilterStore.getState().searchQuery).toBe('');

    fireEvent.change(searchInput, { target: { value: 'Pizza' } });
    expect(useFilterStore.getState().searchQuery).toBe('Pizza');
  });
});