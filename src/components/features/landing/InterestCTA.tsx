"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { event } from '@/lib/gtag';
import { WHATSAPP_INTEREST_MESSAGE, WHATSAPP_NUMBER } from '@/lib/constants';
import { MessageCircle } from 'lucide-react';

export const InterestCTA = () => {
  const handleClick = () => {
    event('premium_cta_clicked', {
      event_category: 'engagement',
      event_label: 'Premium CTA Clicked',
    });

    const encodedMessage = encodeURIComponent(WHATSAPP_INTEREST_MESSAGE);
    const phone = WHATSAPP_NUMBER;

    // Try deep link first for mobile
    window.location.href = `whatsapp://send?phone=${phone}&text=${encodedMessage}`;

    // Fallback for desktop/browsers that block the deep link
    setTimeout(() => {
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    }, 800); // 800ms delay to allow the deep link to attempt opening
  };

  return (
    <div className="fixed bottom-4 right-4">
      <Button
        size="lg"
        className="bg-[#25D366] text-white hover:bg-[#25D366]/90 rounded-full shadow-lg flex items-center gap-2 px-6"
        onClick={handleClick}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
        <span>Interested?</span>
      </Button>
    </div>
  );
};