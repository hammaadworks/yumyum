import { MediaDisplay } from '@/components/features/reel/media-display';
import { ReelActionBar } from '@/components/features/reel/reel-action-bar';
import { Dish } from '@/lib/types';
import { useCartStore } from '@/store/use-cart.store';
import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

const MOCK_DISH: Dish = {
  id: '1',
  name: 'Test Dish',
  category: 'Test',
  price: 10,
  image: 'https://example.com/test.png',
  description: '',
  instock: 'yes',
  veg: 'veg',
};

const initialState = useCartStore.getState();

describe('Core Ordering Interactions', () => {
  beforeEach(() => {
    useCartStore.setState(initialState, true);
  });

  // Test Case: 2.5-I-01
  describe('MediaDisplay Double-Tap', () => {
    it('should add an item to the cart on double-tap', () => {
      render(<MediaDisplay dish={MOCK_DISH} />);

      fireEvent.doubleClick(screen.getByRole('img'));

      const cartItems = useCartStore.getState().items;
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].id).toBe(MOCK_DISH.id);
    });

    it('should show a confirmation animation on double-tap', async () => {
      render(<MediaDisplay dish={MOCK_DISH} />);
      fireEvent.doubleClick(screen.getByRole('img'));
      // Wait for the animation element to appear; this avoids flaky synchronous timing assumptions
      await waitFor(() =>
        expect(screen.getByTestId('plus-animation')).toBeInTheDocument(),
      );
    });
  });

  // Test Cases for ReelActionBar Button
  describe('ReelActionBar Add/Remove Button', () => {
    // Test Case: 2.5-B-01
    it('should add an item when "Add to Cart" is clicked', () => {
      render(
        <ReelActionBar
          dish={MOCK_DISH}
          onFilterClick={() => {}}
          onDescriptionClick={() => {}}
        />,
      );
      fireEvent.click(screen.getByLabelText(/add to cart/i));
      const cartItems = useCartStore.getState().items;
      expect(cartItems[0].id).toBe(MOCK_DISH.id);
    });

    // Test Case: 2.5-B-02
    it('should remove an item when the button is clicked again', () => {
      act(() => {
        useCartStore.getState().addItem(MOCK_DISH);
      });
      render(
        <ReelActionBar
          dish={MOCK_DISH}
          onFilterClick={() => {}}
          onDescriptionClick={() => {}}
        />,
      );
      fireEvent.click(screen.getByLabelText(/remove from cart/i));
      const cartItems = useCartStore.getState().items;
      expect(cartItems).toHaveLength(0);
    });

    // Test Case: 2.5-S-01 & 2.5-S-02
    it('should display a different icon based on whether the item is in the cart', () => {
      const { rerender } = render(
        <ReelActionBar
          dish={MOCK_DISH}
          onFilterClick={() => {}}
          onDescriptionClick={() => {}}
        />,
      );
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();

      act(() => {
        useCartStore.getState().addItem(MOCK_DISH);
      });

      rerender(
        <ReelActionBar
          dish={MOCK_DISH}
          onFilterClick={() => {}}
          onDescriptionClick={() => {}}
        />,
      );
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });
});
