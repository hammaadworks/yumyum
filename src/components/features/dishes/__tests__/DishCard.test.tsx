import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DishCard } from '../DishCard';
import { Dish, DishTag } from '@/lib/types';

const mockDish: Dish = {
  id: '1',
  name: 'Test Dish',
  image: 'https://via.placeholder.com/150',
  description: 'Test description',
  price: 10,
  category: 'Test Category',
  instock: 'yes',
  veg: 'veg',
  tag: 'new',
};

describe('DishCard', () => {
  it('should render the dish name', () => {
    render(<DishCard dish={mockDish} onSelect={() => {}} />);
  });

  it('should render the pulsing dot when the dish has a tag', () => {
    render(<DishCard dish={mockDish} onSelect={() => {}} />);
    expect(screen.getByTestId('pulsing-dot')).toBeInTheDocument();
  });

  it('should not render the pulsing dot when the dish has no tag', () => {
    const dishWithoutTag = { ...mockDish, tag: 'normal' as DishTag };
    render(<DishCard dish={dishWithoutTag} onSelect={() => {}} />);
});
});
