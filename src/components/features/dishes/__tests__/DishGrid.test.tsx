import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DishGrid } from '../DishGrid';
import { useFilterStore } from '@/store/use-filter.store';
import { useUIStore } from '@/store/use-ui.store';
import { Dish } from '@/lib/types';

const mockDishes: Dish[] = [
  { id: '1', name: 'Veg Dish', description: 'A delicious veg dish', price: 10, category: 'Main', image: 'https://via.placeholder.com/150', instock: 'yes', veg: 'veg' },
  { id: '2', name: 'Non-Veg Dish', description: 'A delicious non-veg dish', price: 15, category: 'Main', image: 'https://via.placeholder.com/150', instock: 'yes', veg: 'non-veg' },
  { id: '3', name: 'Another Veg Dish', description: 'Another tasty veg option', price: 5, category: 'Starter', image: 'https://via.placeholder.com/150', instock: 'yes', veg: 'veg' },
];

// Mock the stores
jest.mock('@/store/use-filter.store');
jest.mock('@/store/use-ui.store');

describe('DishGrid', () => {
  const mockOpenReelView = jest.fn();

  beforeEach(() => {
    (useFilterStore as jest.Mock).mockReturnValue({ vegOnly: false, sortBy: 'asc', searchQuery: '' });
    (useUIStore as jest.Mock).mockReturnValue({ openReelView: mockOpenReelView });
  });

  it('should render all dishes by default', () => {
    render(<DishGrid dishes={mockDishes} />);
    expect(screen.getByText('Veg Dish')).toBeInTheDocument();
    expect(screen.getByText('Non-Veg Dish')).toBeInTheDocument();
    expect(screen.getByText('Another Veg Dish')).toBeInTheDocument();
  });

  it('should filter for veg dishes only', () => {
    (useFilterStore as jest.Mock).mockReturnValue({ vegOnly: true, sortBy: 'asc', searchQuery: '' });
    render(<DishGrid dishes={mockDishes} />);
    expect(screen.getByText('Veg Dish')).toBeInTheDocument();
    expect(screen.queryByText('Non-Veg Dish')).not.toBeInTheDocument();
    expect(screen.getByText('Another Veg Dish')).toBeInTheDocument();
  });

  it('should sort dishes by price ascending', () => {
    (useFilterStore as jest.Mock).mockReturnValue({ vegOnly: false, sortBy: 'asc', searchQuery: '' });
    const { getAllByRole } = render(<DishGrid dishes={mockDishes} />);
    const dishNames = getAllByRole('heading').map(h => h.textContent);
    expect(dishNames).toEqual(['Another Veg Dish', 'Veg Dish', 'Non-Veg Dish']);
  });

  it('should sort dishes by price descending', () => {
    (useFilterStore as jest.Mock).mockReturnValue({ vegOnly: false, sortBy: 'desc', searchQuery: '' });
    const { getAllByRole } = render(<DishGrid dishes={mockDishes} />);
    const dishNames = getAllByRole('heading').map(h => h.textContent);
    expect(dishNames).toEqual(['Non-Veg Dish', 'Veg Dish', 'Another Veg Dish']);
  });

  it('should filter by search query', () => {
    (useFilterStore as jest.Mock).mockReturnValue({ vegOnly: false, sortBy: 'asc', searchQuery: 'non-veg' });
    render(<DishGrid dishes={mockDishes} />);
    expect(screen.queryByText('Veg Dish')).not.toBeInTheDocument();
    expect(screen.getByText('Non-Veg Dish')).toBeInTheDocument();
    expect(screen.queryByText('Another Veg Dish')).not.toBeInTheDocument();
  });
});
