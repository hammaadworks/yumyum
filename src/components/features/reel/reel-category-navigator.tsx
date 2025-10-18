import React from 'react';
import { cn } from '@/lib/utils';

interface ReelCategoryNavigatorProps {
  categories: string[];
  activeIndex: number;
  onSelectCategory: (index: number) => void;
}

export function ReelCategoryNavigator({
  categories,
  activeIndex,
  onSelectCategory,
}: ReelCategoryNavigatorProps) {
  const getVisibleCategories = () => {
    const visible = [];
    if (activeIndex > 0) {
      visible.push({ name: categories[activeIndex - 1], index: activeIndex - 1 });
    }
    visible.push({ name: categories[activeIndex], index: activeIndex });
    if (activeIndex < categories.length - 1) {
      visible.push({ name: categories[activeIndex + 1], index: activeIndex + 1 });
    }
    return visible;
  };

  const visibleCategories = getVisibleCategories();

  return (
    <div className="absolute top-0 left-0 right-0 h-16 bg-black/20 backdrop-blur-sm z-10 flex justify-center items-center overflow-hidden">
      <div className="flex items-center space-x-8">
        {visibleCategories.map(({ name, index }) => (
          <button
            key={index}
            onClick={() => onSelectCategory(index)}
            className={cn(
              'transition-all duration-300 ease-in-out text-white/50',
              index === activeIndex && 'active text-white font-bold scale-110'
            )}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}