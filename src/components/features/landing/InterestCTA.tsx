'use client';

import { Button } from '@/components/ui/button';
import { WHATSAPP_INTEREST_MESSAGE, WHATSAPP_NUMBER } from '@/lib/constants';
import { event } from '@/lib/gtag';
import { generateWhatsAppLink } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

export const InterestCTA = () => {
  const handleClick = () => {
    event('premium_cta_clicked', {
      event_category: 'engagement',
      event_label: 'Premium CTA Clicked',
    });

    window.location.href = generateWhatsAppLink(
      WHATSAPP_NUMBER,
      WHATSAPP_INTEREST_MESSAGE,
    );
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
