"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { event } from '@/lib/gtag';

export const InterestCTA = () => {
  const handleClick = () => {
    event('premium_cta_clicked', {
      event_category: 'engagement',
      event_label: 'Premium CTA Clicked',
    });
  };

  return (
    <div className="fixed bottom-4 right-4">
      <Button
        size="lg"
        className="bg-[#FAB12F] text-[#0B0B0B] hover:bg-[#FAB12F]/90 shadow-lg"
        onClick={handleClick}
      >
        Interested?
      </Button>
    </div>
  );
};
