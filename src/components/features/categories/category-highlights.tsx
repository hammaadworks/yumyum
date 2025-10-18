import React from 'react';
import { Dish } from '@/lib/types';

interface CategoryHighlightsProps {
  dishes: Dish[];
}

const CategoryHighlights: React.FC<CategoryHighlightsProps> = ({ dishes }) => {
  const specialCategory = {
    name: 'Specials',
    gradient: 'from-yellow-400 via-red-500 to-pink-500',
  };

  const categories = Array.from(new Set(dishes.map((dish) => dish.category)));
  const hasSpecials = dishes.some((dish) => dish.tag && dish.tag !== 'normal');

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

  return (
    <div className="flex space-x-4 overflow-x-auto p-4 scrollbar-hide">
      {hasSpecials && (
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 rounded-full p-1 bg-gradient-to-r ${specialCategory.gradient}`}>
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">{specialCategory.name}</span>
            </div>
          </div>
        </div>
      )}
      {categories.map((category, index) => (
        <div key={category} className="flex-shrink-0">
          <div className={`w-16 h-16 rounded-full p-1 bg-gradient-to-r ${getGradient(index)}`}>
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">{category}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryHighlights;