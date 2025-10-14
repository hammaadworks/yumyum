import React from 'react';
import { Dish } from '@/lib/types';
import { useFilterStore } from '@/store/use-filter.store';
import { DishCard } from './dish-card';

interface DishGridProps {
  dishes: Dish[];
  onDishSelect: (dish: Dish) => void;
}

export function DishGrid({ dishes, onDishSelect }: DishGridProps) {
  const { vegOnly, sortBy, searchQuery } = useFilterStore();

  const filteredAndSortedDishes = React.useMemo(() => {
    let filtered = [...dishes];

    if (vegOnly) {
      filtered = filtered.filter(dish => dish.veg === 'veg');
    }

    if (searchQuery) {
      filtered = filtered.filter(dish =>
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'asc') {
        return a.price - b.price;
      }
      return b.price - a.price;
    });

    return filtered;
  }, [dishes, vegOnly, sortBy, searchQuery]);

  if (filteredAndSortedDishes.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p>No dishes match your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
      {filteredAndSortedDishes.map(dish => (
        <DishCard key={dish.id} dish={dish} onSelect={onDishSelect} />
      ))}
    </div>
  );
}