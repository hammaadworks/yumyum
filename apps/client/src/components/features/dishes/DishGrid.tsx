import { Dish } from '@/lib/types';

export function DishGrid({ dishes }: { dishes: Dish[] }) {
  return (
    <div>
      {dishes.map(dish => (
        <div key={dish.id}>
          <h2>{dish.name}</h2>
          <p>{dish.price}</p>
        </div>
      ))}
    </div>
  );
}
