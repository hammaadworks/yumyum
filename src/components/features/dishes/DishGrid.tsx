'use client';

import { useMemo } from 'react';
import { Dish } from '@/lib/types';
import { useFilterStore } from '@/store/use-filter.store';
import { useUIStore } from '@/store/use-ui.store';
import { DishCard } from './DishCard';

interface DishGridProps {
  dishes: Dish[];
}

export function DishGrid({ dishes }: DishGridProps) {
  const { vegOnly, sortBy, searchQuery } = useFilterStore();
  const openReelView = useUIStore((state) => state.openReelView);

  const filteredAndSortedDishes = useMemo(() => {
    let filtered = [...dishes];

    // Filter by veg/non-veg
    if (vegOnly) {
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
      if (sortBy === 'asc') {
        return a.price - b.price;
      }
      return b.price - a.price;
    });

    return filtered;
  }, [dishes, vegOnly, sortBy, searchQuery]);

  const handleCardClick = (dishId: string) => {
    openReelView();
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