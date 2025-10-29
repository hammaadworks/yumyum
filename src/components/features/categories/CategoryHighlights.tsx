import React from 'react';
import { Dish } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryHighlightsProps {
  dishes: Dish[];
  onCategorySelect: (category: string) => void;
}

export const CategoryHighlights: React.FC<CategoryHighlightsProps> = ({ dishes, onCategorySelect }) => {
  const specialCategory = {
    name: 'Specials',
    gradient: 'from-yellow-400 via-red-500 to-pink-500',
  };

  const categories = Array.from(new Set(dishes.map((dish) => dish.category))).sort();
  const hasSpecials = dishes.some((dish) => dish.tag && dish.tag !== 'normal');

  if (!hasSpecials && categories.length === 0) {
    return null;
  }

  const getGradient = (index: number) => {
    const gradients = [
      'from-blue-400 to-purple-500',
      'from-green-400 to-blue-500',
      'from-pink-500 to-orange-500',
      'from-indigo-500 to-purple-600',
      'from-red-500 to-yellow-500',
    ];
    return gradients[index % gradients.length];
  };

  const buttonBaseClasses = "flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";

  return (
    <div className="flex space-x-4 overflow-x-auto p-4 scrollbar-hide">
      {hasSpecials && (
        <button className={cn(buttonBaseClasses)} onClick={() => onCategorySelect('Specials')}>
          <div className={`w-16 h-16 rounded-full p-1 bg-gradient-to-r ${specialCategory.gradient}`}>
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">{specialCategory.name}</span>
            </div>
          </div>
        </button>
      )}
      {categories.map((category, index) => (
        <button key={category} className={cn(buttonBaseClasses)} onClick={() => onCategorySelect(category)}>
          <div className={`w-16 h-16 rounded-full p-1 bg-gradient-to-r ${getGradient(index)}`}>
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">{category}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
