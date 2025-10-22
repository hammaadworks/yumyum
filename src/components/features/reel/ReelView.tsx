import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Dish } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/use-ui.store';
import { GlobalCart } from '@/components/shared/GlobalCart';
import { Button } from '@/components/ui/Button';
import { MediaDisplay } from './MediaDisplay';
import { ReelCategoryNavigator } from './ReelCategoryNavigator';
import { ReelActionBar } from './ReelActionBar';

import { FilterDrawer } from './drawers/FilterDrawer';
import { DescriptionDrawer } from './drawers/DescriptionDrawer';

interface ReelViewProps {
  dishes: Dish[];
  categories: string[];
  activeIndex: number;
  isReelViewOpen: boolean;
  closeReelView: () => void;
  setActiveIndex: (index: number) => void;
}

export function ReelView({
  dishes,
  categories,
  activeIndex,
  isReelViewOpen,
  closeReelView,
  setActiveIndex,
}: ReelViewProps) {
  const sortedDishes = React.useMemo(() => {
    const inStock = dishes.filter(d => d.instock === 'yes');
    const outOfStock = dishes.filter(d => d.instock === 'no');
    return [...inStock, ...outOfStock];
  }, [dishes]);

  const [isFilterDrawerOpen, setFilterDrawerOpen] = React.useState(false);
  const [isDescriptionDrawerOpen, setDescriptionDrawerOpen] = React.useState(false);

  const dishRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isReelViewOpen && dishRefs.current[activeIndex]) {
      dishRefs.current[activeIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [isReelViewOpen, activeIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentRefs = dishRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [sortedDishes, setActiveIndex]);

  const handleCategorySelect = (index: number) => {
    setActiveIndex(index);
    dishRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <AnimatePresence>
      {isReelViewOpen && (
        <motion.div
          data-testid="reel-view-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        >
          <GlobalCart />
          <ReelCategoryNavigator
            categories={categories}
            activeIndex={activeIndex}
            onSelectCategory={handleCategorySelect}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20 rounded-full"
            onClick={closeReelView}
            aria-label="Close reel view"
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="h-full w-full overflow-y-auto snap-y snap-mandatory">
            {sortedDishes.map((dish, index) => (
              <div
                key={dish.id}
                ref={(el) => { dishRefs.current[index] = el; }}
                data-index={index}
                data-testid="dish-item"
                className={cn(
                  "h-full w-full flex items-center justify-center snap-start relative",
                  dish.instock === 'no' && 'opacity-50'
                )}
              >
                <MediaDisplay dish={dish} />
                <ReelActionBar
                  dish={dish}
                  onFilterClick={() => setFilterDrawerOpen(true)}
                  onDescriptionClick={() => setDescriptionDrawerOpen(true)}
                />
              </div>
            ))}
          </div>
          <FilterDrawer open={isFilterDrawerOpen} onOpenChange={setFilterDrawerOpen} />
          <DescriptionDrawer
            dish={sortedDishes[activeIndex]}
            open={isDescriptionDrawerOpen}
            onOpenChange={setDescriptionDrawerOpen}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}