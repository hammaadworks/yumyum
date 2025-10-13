'use client';

import { useMemo } from 'react';
import { Dish } from '@/lib/types';
import { useFilterStore } from '@/store/use-filter.store';
import { useUiStore } from '@/store/use-ui.store';
import { DishCard } from './DishCard';

interface DishGridProps {
  dishes: Dish[];
}

/**
     * Renders a responsive grid of dishes after applying active filters and sorting.
     *
     * Filters the provided dishes by veg-only and search query, sorts them by price according to the current sort order, and renders a DishCard for each result. Clicking a card opens the reel view with that dish as the initial selection. If no dishes remain after filtering, renders a centered "No dishes match your current filters." message.
     *
     * @param dishes - The list of dishes to filter, sort, and display.
     * @returns A JSX element containing either a responsive grid of DishCard components or an empty-state message.
     */
    export function DishGrid({ dishes }: DishGridProps) {
  const { isVegOnly, sortOrder, searchQuery } = useFilterStore();
  const openReelView = useUiStore((state) => state.openReelView);

  const filteredAndSortedDishes = useMemo(() => {
    let filtered = [...dishes];

    // Filter by veg/non-veg
    if (isVegOnly) {
      filtered = filtered.filter((dish) => dish.veg === 'veg');
    }

    // Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(lowercasedQuery) ||
          dish.description.toLowerCase().includes(lowercasedQuery),
      );
    }

    // Sort by price
    filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price;
      }
      return b.price - a.price;
    });

    return filtered;
  }, [dishes, isVegOnly, sortOrder, searchQuery]);

  const handleCardClick = (dishId: string) => {
    openReelView({ initialDishId: dishId });
  };

  if (filteredAndSortedDishes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No dishes match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {filteredAndSortedDishes.map((dish) => (
        <DishCard
          key={dish.id}

              dish={dish}

              onClick={() => handleCardClick(dish.id)}

            />

          ))}

        </div>

      );

    }

    