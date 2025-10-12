'use client';

import { useMemo } from 'react';
import { Dish } from '@/lib/types';
import { useFilterStore } from '@/store/use-filter.store';
import { DishCard } from './DishCard';

interface DishGridProps {
  dishes: Dish[];
}

export function DishGrid({ dishes }: DishGridProps) {
  const { isVegOnly, sortOrder, searchQuery } = useFilterStore();

  const filteredAndSortedDishes = useMemo(() => {
    let filtered = [...dishes];

    // Filter by veg/non-veg
    if (isVegOnly) {
      filtered = filtered.filter((dish) => dish.veg === 'veg');
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((dish) =>
        dish.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    // Placeholder for reel view logic
    console.log(`Open reel view for dish: ${dishId}`);
  };

  if (filteredAndSortedDishes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No dishes match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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