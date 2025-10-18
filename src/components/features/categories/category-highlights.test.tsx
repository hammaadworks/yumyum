import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategoryHighlights } from './category-highlights';
import { Dish } from '@/lib/types';

const mockDishes: Dish[] = [
  { id: '1', name: 'Dish 1', category: 'Category A', price: 10, instock: 'yes', veg: 'veg' },
  { id: '2', name: 'Dish 2', category: 'Category B', price: 15, instock: 'yes', veg: 'non-veg' },
  { id: '3', name: 'Dish 3', category: 'Category A', price: 5, instock: 'yes', veg: 'veg', tag: 'new' },
];

describe('CategoryHighlights', () => {
  const mockOnCategorySelect = jest.fn();

  it('should render all categories', () => {
    render(<CategoryHighlights dishes={mockDishes} onCategorySelect={mockOnCategorySelect} />);
    expect(screen.getByText('Category A')).toBeInTheDocument();
    expect(screen.getByText('Category B')).toBeInTheDocument();
  });

  it('should render the "Specials" category when there are special dishes', () => {
    render(<CategoryHighlights dishes={mockDishes} onCategorySelect={mockOnCategorySelect} />);
    expect(screen.getByText('Specials')).toBeInTheDocument();
  });

  it('should not render the "Specials" category when there are no special dishes', () => {
    const dishesWithoutSpecials = mockDishes.map(dish => ({ ...dish, tag: 'normal' }));
    render(<CategoryHighlights dishes={dishesWithoutSpecials} onCategorySelect={mockOnCategorySelect} />);
    expect(screen.queryByText('Specials')).not.toBeInTheDocument();
  });

  it('should call onCategorySelect when a category is clicked', () => {
    render(<CategoryHighlights dishes={mockDishes} onCategorySelect={mockOnCategorySelect} />);
    fireEvent.click(screen.getByText('Category A'));
    expect(mockOnCategorySelect).toHaveBeenCalledWith('Category A');
  });
});
