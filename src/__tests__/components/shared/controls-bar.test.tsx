import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ControlsBar } from '@/components/shared/controls-bar';
import { useFilterStore } from '@/store/use-filter.store';

// We need to get the initial state for resetting the store before each test
const initialState = useFilterStore.getState();

describe('ControlsBar Component', () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    useFilterStore.setState(initialState);
  });

  // Test Case: 1.5-R-01
  it('should render all controls with default states', () => {
    render(<ControlsBar />);

    expect(screen.getByLabelText(/Veg Only/i)).toBeInTheDocument();
    expect(screen.getByRole('switch')).not.toBeChecked();

    expect(screen.getByLabelText(/Sort by price, currently Low to High/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Search dishes.../i)).toBeInTheDocument();
  });

  // Test Case: 1.5-S-01
  it('should update the store when the "Veg Only" switch is toggled', () => {
    render(<ControlsBar />);
    const vegOnlySwitch = screen.getByRole('switch');

    fireEvent.click(vegOnlySwitch);

    expect(useFilterStore.getState().vegOnly).toBe(true);
  });

  // Test Case: 1.5-S-02 & 1.5-S-03
  it('should update and toggle the store when the sort button is clicked', () => {
    render(<ControlsBar />);
    const sortButton = screen.getByRole('button');

    // First click
    fireEvent.click(sortButton);
    expect(useFilterStore.getState().sortBy).toBe('desc');

    // Second click
    fireEvent.click(sortButton);
    expect(useFilterStore.getState().sortBy).toBe('asc');
  });

  // Test Case: 1.5-R-02
  it('should reflect the store state on initial render', () => {
    // Manually set the store state before rendering
    useFilterStore.setState({ vegOnly: true, sortBy: 'desc' });

    render(<ControlsBar />);

    expect(screen.getByRole('switch')).toBeChecked();
    expect(screen.getByLabelText(/Sort by price, currently High to Low/i)).toBeInTheDocument();
  });
});