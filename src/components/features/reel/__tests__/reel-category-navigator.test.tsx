import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReelCategoryNavigator } from '@/components/features/reel/ReelCategoryNavigator';

const MOCK_CATEGORIES = ['Appetizers', 'Main Course', 'Desserts', 'Drinks'];

describe('ReelCategoryNavigator Component', () => {
  // Test Case: 2.3-R-01
  it('should render the current, previous, and next categories', () => {
    render(<ReelCategoryNavigator categories={MOCK_CATEGORIES} activeIndex={1} onSelectCategory={() => {}} />);

    expect(screen.getByText('Appetizers')).toBeInTheDocument();
    expect(screen.getByText('Main Course')).toBeInTheDocument();
    expect(screen.getByText('Desserts')).toBeInTheDocument();
  });

  it('should apply an active class to the current category', () => {
    render(<ReelCategoryNavigator categories={MOCK_CATEGORIES} activeIndex={1} onSelectCategory={() => {}} />);
    const activeCategory = screen.getByText('Main Course');
    expect(activeCategory).toHaveClass('active');
  });

  // Test Case: 2.3-E-01
  it('should handle the first category correctly (no previous)', () => {
    render(<ReelCategoryNavigator categories={MOCK_CATEGORIES} activeIndex={0} onSelectCategory={() => {}} />);
    expect(screen.getByText('Appetizers')).toBeInTheDocument();
    expect(screen.getByText('Main Course')).toBeInTheDocument();
    expect(screen.queryByText('Desserts')).not.toBeInTheDocument();
  });

  // Test Case: 2.3-E-02
  it('should handle the last category correctly (no next)', () => {
    render(<ReelCategoryNavigator categories={MOCK_CATEGORIES} activeIndex={3} onSelectCategory={() => {}} />);
    expect(screen.getByText('Desserts')).toBeInTheDocument();
    expect(screen.getByText('Drinks')).toBeInTheDocument();
    expect(screen.queryByText('Main Course')).not.toBeInTheDocument();
  });

  // Test Case: 2.3-C-01
  it('should call onSelectCategory with the correct index when next is clicked', () => {
    const handleSelect = jest.fn();
    render(<ReelCategoryNavigator categories={MOCK_CATEGORIES} activeIndex={1} onSelectCategory={handleSelect} />);

    fireEvent.click(screen.getByText('Desserts'));
    expect(handleSelect).toHaveBeenCalledWith(2);
  });

  // Test Case: 2.3-C-02
  it('should call onSelectCategory with the correct index when previous is clicked', () => {
    const handleSelect = jest.fn();
    render(<ReelCategoryNavigator categories={MOCK_CATEGORIES} activeIndex={1} onSelectCategory={handleSelect} />);

    fireEvent.click(screen.getByText('Appetizers'));
    expect(handleSelect).toHaveBeenCalledWith(0);
  });
});