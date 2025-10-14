import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

import { Brand } from '@/lib/types';
import { useUIStore } from '@/store/use-ui.store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FeedbackViewProps {
  brand: Brand;
}

export function FeedbackView({ brand }: FeedbackViewProps) {
  const { isFeedbackViewOpen, closeFeedbackView } = useUIStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [error, setError] = useState<string | null>(null);

  const handleRating = (rate: number) => {
    setRating(rate);
    try {
      if (rate >= 4) {
        if (brand.review_link) {
          window.open(brand.review_link, '_blank');
          closeFeedbackView();
        } else {
          setError('Review link not available');
        }
      } else {
        if (brand.whatsapp) {
          const message = encodeURIComponent(`Feedback for ${brand.name}`);
          window.open(`https://wa.me/${brand.whatsapp}?text=${message}`, '_blank');
          closeFeedbackView();
        } else {
          setError('WhatsApp contact not available');
        }
      }
    } catch (e) {
      setError('Could not open link');
    }
  };

  return (
    <Dialog open={isFeedbackViewOpen} onOpenChange={closeFeedbackView}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a rating</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4">
          {[...Array(5)].map((_, index) => {
            const rate = index + 1;
            return (
              <motion.div
                key={rate}
                whileHover={{ scale: 1.2 }}
                onHoverStart={() => setHoverRating(rate)}
                onHoverEnd={() => setHoverRating(0)}
              >
                <Star
                  className={`h-10 w-10 cursor-pointer ${rate <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => handleRating(rate)}
                />
              </motion.div>
            );
          })}
        </div>
        {error && (
          <div className="text-red-500 text-center p-2">
            {error}
            <button onClick={() => setError(null)} className="text-sm underline ml-2">Dismiss</button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
