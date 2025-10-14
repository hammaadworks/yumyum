import React from 'react';
import { Dish } from '@/lib/types';

interface CategoryHighlightsProps {
  dishes: Dish[];
  onCategorySelect: (category: string) => void;
}

// Helper function to create a deterministic, yet varied, gradient based on category name
const generateGradient = (category: string) => {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return {
    backgroundImage: `linear-gradient(to bottom right, hsl(${h}, 100%, 50%), hsl(${h + 45}, 100%, 50%))`,
  };
};

const CategoryButton = ({ category, onCategorySelect }: { category: string; onCategorySelect: (category: string) => void; }) => {
  const gradientStyle = generateGradient(category);
  return (
    <button onClick={() => onCategorySelect(category)} className="flex flex-col items-center space-y-1 focus:outline-none" aria-label={`View ${category} category`}>
      <div style={gradientStyle} className={`w-16 h-16 rounded-full p-0.5`}>
        <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
          {/* In the future, this could be an icon or image */}
        </div>
      </div>
      <span className="text-xs font-medium">{category}</span>
    </button>
  );
};

export function CategoryHighlights({ dishes, onCategorySelect }: CategoryHighlightsProps) {
  const hasSpecials = dishes.some(dish => dish.tag && dish.tag !== 'normal');
  const categories = [...new Set(dishes.map(dish => dish.category))].sort();

  const allCategories = hasSpecials ? ['Specials', ...categories] : categories;

  if (allCategories.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
      <div className="flex space-x-4 px-4">
        {allCategories.map(category => (
          <CategoryButton key={category} category={category} onCategorySelect={onCategorySelect} />
        ))}
      </div>
    </div>
  );
}