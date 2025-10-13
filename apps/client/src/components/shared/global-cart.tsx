'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/use-cart.store';
import { Button } from '@/components/ui/button';

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
