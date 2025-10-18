
import React from 'react';
import { Button } from '@/components/ui/button';

export const HowToJoinSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold">Start Your Yumyum Menu in 2 Minutes.</h2>
        <p className="text-xl text-muted-foreground mt-2">All you need is your phone, Google Sheets, and your passion.</p>
        <div className="flex justify-center mt-8">
            <ol className="text-left space-y-4">
                <li>1. Send us your menu on WhatsApp.</li>
                <li>2. We set up your Yumyum digital menu instantly.</li>
                <li>3. Share your QR or link with customers.</li>
            </ol>
        </div>
        <Button size="lg" className="mt-8">Join on WhatsApp</Button>
        <p className="text-sm text-muted-foreground mt-4">No fees to start. No app downloads. Cancel anytime.</p>
      </div>
    </section>
  );
};
