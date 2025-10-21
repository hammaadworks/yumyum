import React from 'react';
import Image from 'next/image';
import { Dish } from '@/lib/types';

interface DishCardProps {
  dish: Dish;
  onSelect: (dish: Dish) => void;
}

export function DishCard({ dish, onSelect }: DishCardProps) {
  const hasSpecialTag = dish.tag && dish.tag !== 'normal';

  return (
    <button
      className="relative aspect-square w-full rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      onClick={() => onSelect(dish)}
      data-testid="dish-card"
      data-dish-name={dish.name}
    >
      <Image
        src={dish.image}
        alt={dish.name}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      {hasSpecialTag && (
        <div
          data-testid="pulsing-dot"
          className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary ring-2 ring-background animate-pulse"
        />
      )}
    </button>
  );
}