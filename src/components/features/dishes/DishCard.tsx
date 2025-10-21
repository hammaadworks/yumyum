import React from 'react';
import Image from 'next/image';
import { Dish } from '@/lib/types';
import { cn } from '@/lib/utils';

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
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(dish);
        }
      }}
      aria-label={`View details for ${dish.name}`}
      data-testid="dish-card"
      data-dish-name={dish.name}
    >
      <Image
        src={dish.image}
        alt={dish.name}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
      />
      {hasSpecialTag && (
        <div className="absolute top-2 right-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-strong"></span>
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 p-3">
        <h3 className="text-white font-semibold text-sm">{dish.name}</h3>
      </div>
    </button>
  );
}
