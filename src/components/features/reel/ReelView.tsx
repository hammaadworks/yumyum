'use client';

import { GlobalCart } from '@/components/shared/global-cart';
import { Dish } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/use-ui.store';
import { X } from 'lucide-react';
import { useMemo } from 'react';

interface ReelViewProps {
  dishes: Dish[];
}

/**
 * Render a full-screen, snap-scrolling reel of dishes with in-stock items shown first.
 *
 * The component sorts `dishes` so entries with `instock === 'yes'` appear before those with `instock === 'no'`,
 * renders a translucent backdrop with a top-mounted GlobalCart, and exposes a close control that triggers the UI close action.
 *
 * @param dishes - Array of Dish objects to display; items are presented in-stock first, then out-of-stock.
 * @returns The React element for the full-screen reel overlay containing snap-scrolling dish pages.
 */
export function ReelView({ dishes }: ReelViewProps) {
  const { closeReelView } = useUiStore();

  const sortedDishes = useMemo(() => {
    const inStock = dishes.filter((d) => d.instock === 'yes');
    const outOfStock = dishes.filter((d) => d.instock === 'no');
    return [...inStock, ...outOfStock];
  }, [dishes]);

  // TODO: Scroll to the initialDishId

  return (
    <div
      data-testid="reel-view-container"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in-0"
    >
      <GlobalCart />
      <button
        onClick={closeReelView}
        className="absolute top-4 right-4 z-50 text-white rounded-full bg-black/50 p-2"
        aria-label="Close reel view"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="h-full w-full overflow-y-auto snap-y snap-mandatory">
        {sortedDishes.map((dish, index) => (
          <div
            data-testid="dish-item"
            key={dish.id}
            className={cn(
              'h-full w-full flex flex-col items-center justify-center snap-start text-white',
              { 'opacity-50': dish.instock === 'no' },
            )}
          >
            <h1 className="text-4xl font-bold">{dish.name}</h1>
            <p>{dish.instock === 'no' ? '(Out of Stock)' : ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
