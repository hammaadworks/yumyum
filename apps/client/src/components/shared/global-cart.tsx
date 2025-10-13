'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/use-cart.store';
import { Button } from '@/components/ui/button';

/**
 * Render a fixed shopping cart button that displays the current cart item count.
 *
 * The button shows a shopping cart icon and, when the cart has items, a numeric badge
 * positioned at the top-right. The button's `aria-label` includes the item count.
 * Clicking the button currently logs the cart items to the console (placeholder for opening the Cart Summary drawer).
 *
 * @returns A button element containing a shopping cart icon and a numeric badge when the item count is greater than zero.
 */
export function GlobalCart() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleCartClick = () => {
    // TODO: Implement opening the Cart Summary drawer (Story 2.7)
    console.log('Cart clicked. Items:', items);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-4 left-4 z-50 rounded-full shadow-lg"
      onClick={handleCartClick}
      aria-label={`View cart, ${itemCount} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {itemCount}
        </span>
      )}
    </Button>
  );
}