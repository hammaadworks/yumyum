import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategoryHighlights } from './category-highlights';
import { Dish } from '@/lib/types';
import { useUiStore } from '@/store/use-ui.store';

// Mock the store
jest.mock('@/store/use-ui.store');

const mockDishes: Dish[] = [
  {
    id: '1',
    category: 'Appetizers',
    name: 'Dish 1',
    image: '',
    description: '',
    price: 10,
    instock: 'yes',
    veg: 'veg',
  },
  {
    id: '2',
    category: 'Main Course',
    name: 'Dish 2',
    image: '',
    description: '',
    price: 20,
    instock: 'yes',
    veg: 'non-veg',
  },
  {
    id: '3',
    category: 'Appetizers',
    name: 'Dish 3',
    image: '',
    description: '',
    price: 15,
    instock: 'yes',
    veg: 'veg',
    tag: 'bestseller',
  },
];

describe('CategoryHighlights', () => {
  let openReelView: jest.Mock;

  beforeEach(() => {
    openReelView = jest.fn();
    // This is a more accurate mock for a Zustand store with selectors
    (useUiStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        openReelView,
      };
      return selector(state);
    });
  });

  it("should render the 'Specials' category if a dish has a special tag", () => {
    render(<CategoryHighlights dishes={mockDishes} />);
    expect(screen.getByText('Specials')).toBeInTheDocument();
  });

  it("should not render the 'Specials' category if no dish has a special tag", () => {
    const dishesWithoutSpecial = mockDishes.map((d) => ({ ...d, tag: 'normal' as const }));
    render(<CategoryHighlights dishes={dishesWithoutSpecial} />);
    expect(screen.queryByText('Specials')).not.toBeInTheDocument();
  });

  it('should render unique categories in alphabetical order', () => {
    render(<CategoryHighlights dishes={mockDishes} />);
    const buttons = screen.getAllByRole('button');
    // Specials, Appetizers, Main Course
    expect(buttons).toHaveLength(3);
    expect(buttons[1]).toHaveTextContent('Appetizers');
    expect(buttons[2]).toHaveTextContent('Main Course');
  });

  it('should call openReelView with the first dish of the category', () => {
    render(<CategoryHighlights dishes={mockDishes} />);
    fireEvent.click(screen.getByText('Appetizers'));
    // Dish 1 is the first appetizer
    expect(openReelView).toHaveBeenCalledWith({ initialDishId: '1' });
  });

  it('should call openReelView with the first special dish', () => {
    render(<CategoryHighlights dishes={mockDishes} />);
    fireEvent.click(screen.getByText('Specials'));
    // Dish 3 is the first special dish
    expect(openReelView).toHaveBeenCalledWith({ initialDishId: '3' });
  });
});