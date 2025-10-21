"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
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
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4">
      <Button
        size="lg"
        isIconOnly
        className="bg-[#25D366] text-white hover:bg-[#25D366]/90 rounded-full shadow-lg w-16 h-16"
        onClick={handleClick}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={32} />
      </Button>
    </div>
  );
};
