import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReelActionBar } from '@/components/features/reel/ReelActionBar';
import { Dish } from '@/lib/types';

const MOCK_DISH: Dish = {
  id: '1',
  name: 'Spicy Pizza',
  description: 'A delicious pizza with a spicy kick.',
  price: 12.99,
  tag: 'bestseller',
  category: 'Pizza',
  image: 'pizza.jpg',
  instock: 'yes',
  veg: 'veg',
};

// Mock navigator.share
Object.assign(navigator, {
  share: jest.fn(),
});

describe('ReelActionBar Component', () => {
  beforeEach(() => {
    (navigator.share as jest.Mock).mockClear();
  });

  // Test Case: 2.4-R-01
  it('should render all three action buttons', () => {
    render(
      <ReelActionBar
        dish={MOCK_DISH}
        onFilterClick={() => {}}
        onDescriptionClick={() => {}}
      />,
    );
    expect(screen.getByLabelText(/filter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/share/i)).toBeInTheDocument();
  });

  // Test Case: 2.4-C-01
  it('should call onFilterClick when filter button is clicked', () => {
    const handleFilterClick = jest.fn();
    render(
      <ReelActionBar
        dish={MOCK_DISH}
        onFilterClick={handleFilterClick}
        onDescriptionClick={() => {}}
      />,
    );
    fireEvent.click(screen.getByLabelText(/filter/i));
    expect(handleFilterClick).toHaveBeenCalledTimes(1);
  });

  // Test Case: 2.4-C-02
  it('should call onDescriptionClick when description button is clicked', () => {
    const handleDescriptionClick = jest.fn();
    render(
      <ReelActionBar
        dish={MOCK_DISH}
        onFilterClick={() => {}}
        onDescriptionClick={handleDescriptionClick}
      />,
    );
    fireEvent.click(screen.getByLabelText(/description/i));
    expect(handleDescriptionClick).toHaveBeenCalledTimes(1);
  });

  // Test Case: 2.4-C-03
  it('should call navigator.share with the correct data when share button is clicked', async () => {
    (navigator.share as jest.Mock).mockResolvedValue(undefined);
    render(
      <ReelActionBar
        dish={MOCK_DISH}
        onFilterClick={() => {}}
        onDescriptionClick={() => {}}
      />,
    );

    fireEvent.click(screen.getByLabelText(/share/i));

    expect(navigator.share).toHaveBeenCalledWith({
      title: MOCK_DISH.name,
      text: MOCK_DISH.description,
      url: `http://localhost/?dish=${MOCK_DISH.id}`,
    });
  });
});
