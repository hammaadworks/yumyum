import { Dish } from '@/lib/types';

/**
 * Render a responsive grid of dish cards.
 *
 * Each card displays the dish name and its price formatted to two decimal places.
 *
 * @param dishes - Array of `Dish` objects to display
 * @returns A React element containing a responsive grid of dish cards
 */
export function DishGrid({ dishes }: { dishes: Dish[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {dishes.map(dish => (
        <div key={dish.id} className="border p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold">{dish.name}</h2>
          <p className="text-gray-700">${dish.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}