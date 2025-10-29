import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Brand } from '@/lib/types';
import { useUIStore } from '@/store/use-ui.store';
import { isValidHttpUrl, normalizeWhatsapp, validateWhatsapp, openPopup, generateWhatsAppLink } from '@/lib/utils';
import { WHATSAPP_FEEDBACK_MESSAGE } from '@/lib/constants';

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

    if (rate >= 4) {
      if (!brand.review_link) {
        setError('Review link not available');
        return;
      }
      if (!isValidHttpUrl(brand.review_link)) {
        setError('Invalid review URL provided');
        return;
      }

      try {
        if (!openPopup(brand.review_link)) {
          setError(
            'Popup blocked by browser. Please allow popups for this site.',
          );
          return;
        }
        closeFeedbackView();
      } catch (err) {
        console.error('Failed to open review link:', err);
        setError('Could not open review link. Please try again.');
      }
    } else {
      if (!brand.whatsapp) {
        setError('WhatsApp contact not available');
        return;
      }
      if (!validateWhatsapp(brand.whatsapp)) {
        setError('Invalid WhatsApp number provided');
        return;
      }

      try {
        const whatsappUrl = generateWhatsAppLink(brand.whatsapp, `${WHATSAPP_FEEDBACK_MESSAGE} for ${brand.name}`);

        if (!openPopup(whatsappUrl)) {
          setError(
            'Popup blocked by browser. Please allow popups for this site.',
          );
          return;
        }
        closeFeedbackView();
      } catch (err) {
        console.error('Failed to open WhatsApp:', err);
        setError('Could not open WhatsApp. Please try again.');
      }
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
            <button
              onClick={() => setError(null)}
              className="text-sm underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
