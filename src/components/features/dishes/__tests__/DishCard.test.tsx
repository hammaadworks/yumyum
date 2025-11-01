import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DishCard } from '@/components/features/dishes/DishCard';
import { MOCK_DISHES } from '@/lib/mock-data';

describe('DishCard Component', () => {
  it('should render the dish name', () => {
    render(<DishCard dish={MOCK_DISHES[0]} onSelect={() => {}} />);
    expect(screen.getByText('Veggie Burger')).toBeInTheDocument();
  });

  // Test Case: 1.6-C-02
  it('should render a pulsing dot if the dish has a special tag', () => {
    const specialDish = MOCK_DISHES.find((d) => d.tag === 'bestseller');
    expect(specialDish).toBeDefined();
    if (!specialDish)
      throw new Error(
        'Test setup: no dish with tag "bestseller" in MOCK_DISHES',
      );
    render(<DishCard dish={specialDish} onSelect={() => {}} />);
    expect(screen.getByTestId('pulsing-dot')).toBeInTheDocument();
  });

  // Test Case: 1.6-C-01
  it('should not render a pulsing dot if the dish has no special tag', () => {
    const normalDish = MOCK_DISHES.find((d) => !d.tag);
    expect(normalDish).toBeDefined();
    if (!normalDish)
      throw new Error('test setup: no normal dish in MOCK_DISHES');
    render(<DishCard dish={normalDish} onSelect={() => {}} />);
    expect(screen.queryByTestId('pulsing-dot')).not.toBeInTheDocument();
  });

  // Test Case: 1.6-C-03
  it('should call onSelect with the correct dish when clicked', () => {
    const handleSelect = jest.fn();
    const dish = MOCK_DISHES[0];
    render(<DishCard dish={dish} onSelect={handleSelect} />);
    fireEvent.click(screen.getByTestId('dish-card'));
    expect(handleSelect).toHaveBeenCalledWith(dish);
  });
});
