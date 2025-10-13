import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReelView } from './ReelView';
import { useUiStore } from '@/store/use-ui.store';
import { Dish } from '@/lib/types';
import { act } from '@testing-library/react';

// Mock the GlobalCart component
jest.mock('@/components/shared/global-cart', () => ({
  GlobalCart: () => <div data-testid="global-cart"></div>,
}));

const mockDishes: Dish[] = [
  { id: '1', name: 'Dish 1', category: 'A', price: 10, instock: 'yes', veg: 'veg', image: '', description: '' },
  { id: '2', name: 'Dish 2', category: 'B', price: 20, instock: 'no', veg: 'non-veg', image: '', description: '' },
  { id: '3', name: 'Dish 3', category: 'A', price: 5, instock: 'yes', veg: 'veg', image: '', description: '' },
];

describe('ReelView', () => {
  it('renders the component with sorted dishes', () => {
    render(<ReelView dishes={mockDishes} />);

    const dishNames = screen.getAllByRole('heading');
    // 'Dish 2' (out of stock) should be last
    expect(dishNames.map((h) => h.textContent)).toEqual(['Dish 1', 'Dish 3', 'Dish 2']);
  });

  it('calls closeReelView when the close button is clicked', () => {
    const closeReelView = jest.fn();
    useUiStore.setState({ closeReelView });

    render(<ReelView dishes={mockDishes} />);

    const closeButton = screen.getByLabelText('Close reel view');
    fireEvent.click(closeButton);

    expect(closeReelView).toHaveBeenCalledTimes(1);
  });

  it('renders the GlobalCart component', () => {
    render(<ReelView dishes={mockDishes} />);
    expect(screen.getByTestId('global-cart')).toBeInTheDocument();
  });

  it('applies opacity to out of stock items', () => {
    render(<ReelView dishes={mockDishes} />);
    const dish2 = screen.getByText('Dish 2').parentElement;
    expect(dish2).toHaveClass('opacity-50');
  });
});
