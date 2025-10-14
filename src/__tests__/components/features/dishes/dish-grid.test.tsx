import { DishCard } from '@/components/features/dishes/dish-card';
import { DishGrid } from '@/components/features/dishes/dish-grid';
import { Dish } from '@/lib/types';
import { useFilterStore } from '@/store/use-filter.store';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const MOCK_DISHES: Dish[] = [
  { id: '1', name: 'Veggie Burger', category: 'Burgers', price: 10, veg: 'veg', image: 'https://example.com/v.png', description: '', instock: 'yes' },
  { id: '2', name: 'Chicken Burger', category: 'Burgers', price: 12, veg: 'non-veg', image: 'https://example.com/c.png', description: '', instock: 'yes' },
  { id: '3', name: 'Margherita Pizza', category: 'Pizza', price: 15, veg: 'veg', image: 'https://example.com/m.png', description: '', instock: 'yes', tag: 'bestseller' },
  { id: '4', name: 'Pepperoni Pizza', category: 'Pizza', price: 8, veg: 'non-veg', image: 'https://example.com/p.png', description: '', instock: 'yes' },
];

const initialState = useFilterStore.getState();

describe('DishGrid Component', () => {
  beforeEach(() => {
    useFilterStore.setState(initialState);
  });

  // Test Case: 1.6-G-01
  it('should render all dishes sorted by price ascending by default', () => {
    render(<DishGrid dishes={MOCK_DISHES} onDishSelect={() => {}} />);
    const dishNames = screen.getAllByTestId('dish-card').map(card => card.getAttribute('data-dish-name'));
    expect(dishNames).toEqual(['Pepperoni Pizza', 'Veggie Burger', 'Chicken Burger', 'Margherita Pizza']);
  });

  // Test Case: 1.6-G-02
  it('should filter for veg dishes only', () => {
    useFilterStore.setState({ vegOnly: true });
    render(<DishGrid dishes={MOCK_DISHES} onDishSelect={() => {}} />);
    const dishNames = screen.getAllByTestId('dish-card').map(card => card.getAttribute('data-dish-name'));
    expect(dishNames).toEqual(['Veggie Burger', 'Margherita Pizza']);
  });

  // Test Case: 1.6-G-03
  it('should sort dishes by price descending', () => {
    useFilterStore.setState({ sortBy: 'desc' });
    render(<DishGrid dishes={MOCK_DISHES} onDishSelect={() => {}} />);
    const dishNames = screen.getAllByTestId('dish-card').map(card => card.getAttribute('data-dish-name'));
    expect(dishNames).toEqual(['Margherita Pizza', 'Chicken Burger', 'Veggie Burger', 'Pepperoni Pizza']);
  });

  // Test Case: 1.6-G-04
  it('should filter and sort simultaneously', () => {
    useFilterStore.setState({ vegOnly: true, sortBy: 'desc' });
    render(<DishGrid dishes={MOCK_DISHES} onDishSelect={() => {}} />);
    const dishNames = screen.getAllByTestId('dish-card').map(card => card.getAttribute('data-dish-name'));
    expect(dishNames).toEqual(['Margherita Pizza', 'Veggie Burger']);
  });
});

describe('DishCard Component', () => {
    // Test Case: 1.6-C-02
  it('should render a pulsing dot if the dish has a special tag', () => {
    const specialDish = MOCK_DISHES.find(d => d.tag === 'bestseller');
    expect(specialDish).toBeDefined();
    // TypeScript/Narrowing: specialDish is guaranteed by the assertion above in test runtime
    // but we still guard to keep runtime errors explicit for maintainers
    if (!specialDish) throw new Error('Test setup: no dish with tag "bestseller" in MOCK_DISHES');
    render(<DishCard dish={specialDish} onSelect={() => {}} />);
    expect(screen.getByTestId('pulsing-dot')).toBeInTheDocument();
  });

    // Test Case: 1.6-C-01
  it('should not render a pulsing dot if the dish has no special tag', () => {
    const normalDish = MOCK_DISHES.find(d => !d.tag);
    expect(normalDish).toBeDefined();
    if (!normalDish) throw new Error('test setup: no normal dish in MOCK_DISHES');
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