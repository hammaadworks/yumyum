import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategoryHighlights } from '@/components/features/categories/CategoryHighlights';
import { Dish, DishTag } from '@/lib/types';

const MOCK_DISHES_NO_SPECIALS: Dish[] = [
  {
    id: '1',
    name: 'Burger',
    category: 'Burgers',
    price: 10,
    veg: 'non-veg',
    image: '',
    instock: 'yes',
    description: '',
  },
  {
    id: '2',
    name: 'Pizza',
    category: 'Pizza',
    price: 12,
    veg: 'veg',
    image: '',
    instock: 'yes',
    description: '',
  },
];

const MOCK_DISHES_WITH_SPECIALS: Dish[] = [
  {
    id: '1',
    name: 'Special Burger',
    category: 'Burgers',
    price: 10,
    veg: 'non-veg',
    image: '',
    instock: 'yes',
    tag: 'bestseller',
    description: '',
  },
  {
    id: '2',
    name: 'Pizza',
    category: 'Pizza',
    price: 12,
    veg: 'veg',
    image: '',
    instock: 'yes',
    description: '',
  },
];

describe('CategoryHighlights', () => {
  it('should render all categories', () => {
    render(
      <CategoryHighlights
        dishes={MOCK_DISHES_NO_SPECIALS}
        onCategorySelect={() => {}}
      />,
    );
    expect(screen.getByText('Burgers')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  it('should render the "Specials" category when there are special dishes', () => {
    render(
      <CategoryHighlights
        dishes={MOCK_DISHES_WITH_SPECIALS}
        onCategorySelect={() => {}}
      />,
    );
    expect(screen.getByText('Specials')).toBeInTheDocument();
  });

  it('should not render the "Specials" category when there are no special dishes', () => {
    render(
      <CategoryHighlights
        dishes={MOCK_DISHES_NO_SPECIALS}
        onCategorySelect={() => {}}
      />,
    );
    expect(screen.queryByText('Specials')).not.toBeInTheDocument();
  });

  it('should call onCategorySelect when a category is clicked', () => {
    const handleSelect = jest.fn();
    render(
      <CategoryHighlights
        dishes={MOCK_DISHES_NO_SPECIALS}
        onCategorySelect={handleSelect}
      />,
    );

    fireEvent.click(screen.getByText('Burgers'));
    expect(handleSelect).toHaveBeenCalledWith('Burgers');
  });

  it('should derive and render unique categories in alphabetical order', () => {
    render(
      <CategoryHighlights
        dishes={MOCK_DISHES_NO_SPECIALS}
        onCategorySelect={() => {}}
      />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Burgers');
    expect(buttons[1]).toHaveTextContent('Pizza');
  });

  it('should render "Specials" as the first category if a dish has a special tag', () => {
    render(
      <CategoryHighlights
        dishes={MOCK_DISHES_WITH_SPECIALS}
        onCategorySelect={() => {}}
      />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveTextContent('Specials');
  });

  it('should render nothing if the dishes list is empty', () => {
    render(<CategoryHighlights dishes={[]} onCategorySelect={() => {}} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should call onCategorySelect with the correct category name when a button is clicked', () => {
    const handleSelect = jest.fn();
    render(
      <CategoryHighlights
        dishes={MOCK_DISHES_NO_SPECIALS}
        onCategorySelect={handleSelect}
      />,
    );

    const pizzaButton = screen.getByRole('button', { name: /Pizza/i });
    fireEvent.click(pizzaButton);
    expect(handleSelect).toHaveBeenCalledWith('Pizza');
  });
});
