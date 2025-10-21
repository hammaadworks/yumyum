import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Dish } from '@/lib/types';
import { useCartStore } from '@/store/use-cart.store';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface MediaDisplayProps {
  dish: Dish;
}

export function MediaDisplay({ dish }: MediaDisplayProps) {
  const [showPlus, setShowPlus] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDoubleClick = () => {
    addItem(dish);
    setShowPlus(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowPlus(false), 600);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const mediaContent = dish.reel ? (
    <video
      data-testid="video-element"
      src={dish.reel}
      poster={dish.image}
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-contain"
    />
  ) : (
    <Image
      src={dish.image}
      alt={dish.name}
      fill
      className="object-contain"
    />
  );

  return (
    <div className="relative w-full h-full" onDoubleClick={handleDoubleClick}>
      {mediaContent}
      <AnimatePresence>
        {showPlus && (
          <motion.div
            data-testid="plus-animation"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Plus className="h-24 w-24 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}