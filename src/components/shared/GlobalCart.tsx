'use client';

import { Button } from '@/components/ui/Button';
import { useCartItemCount } from '@/store/use-cart.store';
import { useUIStore } from '@/store/use-ui.store';
import { ShoppingCart } from 'lucide-react';

export function GlobalCart() {
  const itemCount = useCartItemCount();
  const { openCartSummary } = useUIStore();

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-4 left-4 z-50 rounded-full shadow-lg h-10 w-10"
      onClick={openCartSummary}
      aria-label={`View cart, ${itemCount} items`}
    >
      <ShoppingCart aria-hidden="true" className="h-5 w-5" />
      {itemCount > 0 && (
        <span
          data-testid="cart-badge"
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
        >
          {itemCount}
        </span>
      )}
    </Button>
  );
}
