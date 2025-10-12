import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dish } from '@/lib/types';

interface DishCardProps {
  dish: Dish;
  onClick: () => void;
}

export function DishCard({ dish, onClick }: DishCardProps) {
  const hasTag = dish.tag && dish.tag !== 'normal';

  return (
    <div
      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <Image
        src={dish.image}
        alt={dish.name}
        fill
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
      />
      {hasTag && (
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
    </div>
  );
}