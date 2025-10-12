import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DishGrid } from '../DishGrid';
import { useFilterStore } from '@/store/use-filter.store';
import { Dish } from '@/lib/types';
import { act } from 'react';

const mockDishes: Dish[] = [
  { id: '1', name: 'Pasta', price: 12.99, veg: 'veg', category: 'Main', description: '', image: '/pasta.jpg', instock: 'yes' },
  { id: '2', name: 'Steak', price: 25.50, veg: 'non-veg', category: 'Main', description: '', image: '/steak.jpg', instock: 'yes' },
  { id: '3', name: 'Salad', price: 8.75, veg: 'veg', category: 'Starter', description: '', image: '/salad.jpg', instock: 'yes' },
  { id: '4', name: 'Burger', price: 15.00, veg: 'non-veg', category: 'Main', description: '', image: '/burger.jpg', instock: 'yes', tag: 'bestseller' },
];

const originalState = useFilterStore.getState();

describe('DishGrid', () => {
  beforeEach(() => {
    act(() => {
      useFilterStore.setState(originalState);
    });
  });

  it('should render all dishes by default', () => {
    render(<DishGrid dishes={mockDishes} />);
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.getByText('Steak')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
    expect(screen.getByText('Burger')).toBeInTheDocument();
  });

  it('should filter for veg dishes when "Veg Only" is active', () => {
    act(() => {
      useFilterStore.getState().toggleVegOnly();
    });
    render(<DishGrid dishes={mockDishes} />);
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.queryByText('Steak')).not.toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
    expect(screen.queryByText('Burger')).not.toBeInTheDocument();
  });

  it('should sort dishes by price ascending', () => {
    render(<DishGrid dishes={mockDishes} />);
    const dishNames = screen.getAllByRole('heading').map(h => h.textContent);
    expect(dishNames).toEqual(['Salad', 'Pasta', 'Burger', 'Steak']);
  });

  it('should sort dishes by price descending', () => {
    act(() => {
      useFilterStore.getState().toggleSortOrder();
    });
    render(<DishGrid dishes={mockDishes} />);
    const dishNames = screen.getAllByRole('heading').map(h => h.textContent);
    expect(dishNames).toEqual(['Steak', 'Burger', 'Pasta', 'Salad']);
  });

  it('should filter by search query', () => {
    act(() => {
        useFilterStore.getState().setSearchQuery('bu');
    });
    render(<DishGrid dishes={mockDishes} />);
    expect(screen.queryByText('Pasta')).not.toBeInTheDocument();
    expect(screen.queryByText('Steak')).not.toBeInTheDocument();
    expect(screen.queryByText('Salad')).not.toBeInTheDocument();
    expect(screen.getByText('Burger')).toBeInTheDocument();
  });

  it('should show a message when no dishes match filters', () => {
    act(() => {
        useFilterStore.getState().setSearchQuery('NonExistentDish');
    });
    render(<DishGrid dishes={mockDishes} />);
    expect(screen.getByText('No dishes match your current filters.')).toBeInTheDocument();
  });
});