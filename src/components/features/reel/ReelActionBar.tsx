import { Button } from '@/components/ui/button';
import { Dish } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/use-cart.store';
import { Check, Funnel, Info, Plus, Share2 } from 'lucide-react';

interface ReelActionBarProps {
  dish: Dish;
  onFilterClick: () => void;
  onDescriptionClick: () => void;
}

export function ReelActionBar({
  dish,
  onFilterClick,
  onDescriptionClick,
}: ReelActionBarProps) {
  const { items, addItem, removeItem } = useCartStore();
  const isInCart = items.some((item) => item.id === dish.id);

  const handleCartToggle = () => {
    if (isInCart) {
      removeItem(dish.id);
    } else {
      addItem(dish);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: dish.name,
          text: dish.description,
          url: `${window.location.origin}${window.location.pathname}?dish=${dish.id}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      console.warn('Web Share API not supported. Share functionality is not available on this browser.');
    }
  };

  return (
    <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10 flex flex-col space-y-4">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black/30 text-white"
        aria-label="Filter"
        onClick={onFilterClick}
      >
        <Funnel className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black/30 text-white"
        aria-label="View description"
        onClick={onDescriptionClick}
      >
        <Info className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'rounded-full bg-black/30 text-white transition-colors',
          isInCart && 'bg-primary text-primary-foreground',
        )}
        aria-label={isInCart ? 'Remove from cart' : 'Add to cart'}
        onClick={handleCartToggle}
      >
        {isInCart ? (
          <Check data-testid="check-icon" className="h-6 w-6" />
        ) : (
          <Plus data-testid="plus-icon" className="h-6 w-6" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black/30 text-white"
        aria-label="Share"
        onClick={handleShare}
      >
        <Share2 className="h-6 w-6" />
      </Button>
    </div>
  );
}
