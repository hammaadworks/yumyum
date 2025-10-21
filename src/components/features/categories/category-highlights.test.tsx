import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategoryHighlights } from './category-highlights';
import { Dish, DishTag } from '@/lib/types';

const mockDishes: Dish[] = [
  { id: '1', name: 'Dish 1', category: 'Category A', price: 10, instock: 'yes', veg: 'veg', image: '/images/dish1.jpg', description: 'Description for Dish 1' },
  { id: '2', name: 'Dish 2', category: 'Category B', price: 15, instock: 'yes', veg: 'non-veg', image: '/images/dish2.jpg', description: 'Description for Dish 2' },
  { id: '3', name: 'Dish 3', category: 'Category A', price: 5, instock: 'yes', veg: 'veg', tag: 'new', image: '/images/dish3.jpg', description: 'Description for Dish 3' },
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
    const dishesWithoutSpecials = mockDishes.map(dish => ({ ...dish, tag: 'normal' as DishTag }));
    render(<CategoryHighlights dishes={dishesWithoutSpecials} onCategorySelect={mockOnCategorySelect} />);
    expect(screen.queryByText('Specials')).not.toBeInTheDocument();
  });

  it('should call onCategorySelect when a category is clicked', () => {
    render(<CategoryHighlights dishes={mockDishes} onCategorySelect={mockOnCategorySelect} />);
    fireEvent.click(screen.getByText('Category A'));
    expect(mockOnCategorySelect).toHaveBeenCalledWith('Category A');
  });
});
