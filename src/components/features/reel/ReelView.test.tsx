import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReelView } from './reel-view';
import { Dish } from '@/lib/types';

const mockDishes: Dish[] = [
  { id: '1', name: 'Dish 1', category: 'Category A', price: 10, instock: 'yes', veg: 'veg' },
  { id: '2', name: 'Dish 2', category: 'Category B', price: 15, instock: 'yes', veg: 'non-veg' },
];

const mockCategories = ['Category A', 'Category B'];

describe('ReelView', () => {
  const mockCloseReelView = jest.fn();
  const mockSetActiveIndex = jest.fn();

  it('should not be visible when isReelViewOpen is false', () => {
    render(
      <ReelView
        dishes={mockDishes}
        categories={mockCategories}
        activeIndex={0}
        isReelViewOpen={false}
        closeReelView={mockCloseReelView}
        setActiveIndex={mockSetActiveIndex}
      />
    );
    expect(screen.queryByTestId('reel-view-container')).not.toBeInTheDocument();
  });

  it('should be visible when isReelViewOpen is true', () => {
    render(
      <ReelView
        dishes={mockDishes}
        categories={mockCategories}
        activeIndex={0}
        isReelViewOpen={true}
        closeReelView={mockCloseReelView}
        setActiveIndex={mockSetActiveIndex}
      />
    );
    expect(screen.getByTestId('reel-view-container')).toBeInTheDocument();
  });

  it('should call closeReelView when the close button is clicked', () => {
    render(
      <ReelView
        dishes={mockDishes}
        categories={mockCategories}
        activeIndex={0}
        isReelViewOpen={true}
        closeReelView={mockCloseReelView}
        setActiveIndex={mockSetActiveIndex}
      />
    );
    fireEvent.click(screen.getByLabelText('Close reel view'));
    expect(mockCloseReelView).toHaveBeenCalled();
  });
});
