
import React from 'react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  return (
    <section className="text-center py-20">
      <h1 className="text-5xl font-bold">Turn Your Street Food Into a Digital Menu — Instantly.</h1>
      <p className="text-xl text-muted-foreground mt-4">Use Google Sheets + WhatsApp to sell more — no apps, no stress.</p>
      <div className="mt-8">
        {/* Placeholder for visual */}
        <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
      </div>
      <Button size="lg" className="mt-8">Create My Menu</Button>
      <p className="text-sm text-muted-foreground mt-4">Powered by Google Sheets • WhatsApp Integrated • No Downloads.</p>
    </section>
  );
};
