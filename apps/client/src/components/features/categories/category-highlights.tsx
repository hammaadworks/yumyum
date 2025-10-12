import * as React from "react";
import { Dish } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface CategoryHighlightsProps {
  dishes: Dish[];
  onCategorySelect: (category: string) => void;
}

const CategoryHighlights: React.FC<CategoryHighlightsProps> = ({
  dishes,
  onCategorySelect,
}) => {
  const categories = React.useMemo(() => {
    const hasSpecial = dishes.some(
      (dish) => dish.tag && dish.tag !== "normal"
    );
    const regularCategories = Array.from(
      new Set(dishes.map((dish) => dish.category))
    ).sort();

    return hasSpecial
      ? ["Specials", ...regularCategories]
      : regularCategories;
  }, [dishes]);

  const getGradient = (category: string) => {
    const gradients = [
      "from-red-500 to-yellow-500",
      "from-green-400 to-blue-500",
      "from-purple-500 to-pink-500",
      "from-yellow-400 to-orange-500",
      "from-teal-400 to-cyan-500",
    ];
    const hash = category
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
      <div className="flex space-x-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className="flex-shrink-0"
          >
            <div
              className={cn(
                "relative w-20 h-20 rounded-full p-1 bg-gradient-to-r",
                getGradient(category)
              )}
            >
              <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-center px-1">
                  {category}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

CategoryHighlights.displayName = "CategoryHighlights";

export { CategoryHighlights };