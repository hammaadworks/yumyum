import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategoryHighlights } from '@/components/features/categories/category-highlights';
import { Dish } from '@/lib/types';

const MOCK_DISHES_NO_SPECIALS: Dish[] = [
  { id: '1', name: 'Margherita', category: 'Pizza', price: 10, image: '', description: '', instock: 'yes', veg: 'veg' },
  { id: '2', name: 'Cheeseburger', category: 'Burgers', price: 12, image: '', description: '', instock: 'yes', veg: 'non-veg' },
  { id: '3', name: 'Pepperoni', category: 'Pizza', price: 11, image: '', description: '', instock: 'yes', veg: 'non-veg' },
];

const MOCK_DISHES_WITH_SPECIALS: Dish[] = [
  { id: '1', name: 'Margherita', category: 'Pizza', price: 10, image: '', description: '', instock: 'yes', veg: 'veg', tag: 'normal' },
  { id: '2', name: 'Special Burger', category: 'Burgers', price: 15, image: '', description: '', instock: 'yes', veg: 'non-veg', tag: 'bestseller' },
  { id: '3', name: 'Veggie Pizza', category: 'Pizza', price: 11, image: '', description: '', instock: 'yes', veg: 'veg' },
];

describe('CategoryHighlights Component', () => {
  // Test Case: 1.4-L-01
  it('should derive and render unique categories in alphabetical order', () => {
    render(<CategoryHighlights dishes={MOCK_DISHES_NO_SPECIALS} onCategorySelect={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Burgers');
    expect(buttons[1]).toHaveTextContent('Pizza');
  });

  // Test Case: 1.4-L-02
  it('should render "Specials" as the first category if a dish has a special tag', () => {
    render(<CategoryHighlights dishes={MOCK_DISHES_WITH_SPECIALS} onCategorySelect={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveTextContent('Specials');
    expect(buttons[1]).toHaveTextContent('Burgers');
    expect(buttons[2]).toHaveTextContent('Pizza');
  });

  // Test Case: 1.4-L-03
  it('should render nothing if the dishes list is empty', () => {
    const { container } = render(<CategoryHighlights dishes={[]} onCategorySelect={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  // Test Case: 1.4-C-01
  it('should call onCategorySelect with the correct category name when a button is clicked', () => {
    const handleSelect = jest.fn();
    render(<CategoryHighlights dishes={MOCK_DISHES_NO_SPECIALS} onCategorySelect={handleSelect} />);

    const pizzaButton = screen.getByRole('button', { name: /Pizza/i });
    fireEvent.click(pizzaButton);

    expect(handleSelect).toHaveBeenCalledWith('Pizza');
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});