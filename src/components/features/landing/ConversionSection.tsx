
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Sheet } from 'lucide-react';

export const ConversionSection = () => {
  return (
    <section className="py-20 bg-[#FEF3E2]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#0B0B0B]">Bring your food online — no tech, no stress.</h2>
        <p className="text-muted-foreground mt-2">Join 100+ vendors already using Yumyum.</p>
        <Button size="lg" className="mt-8 bg-[#FAB12F] text-[#0B0B0B] hover:bg-[#FAB12F]/90">
          <Sheet className="mr-2 h-4 w-4" />
          Start with Google Sheets
        </Button>
        <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
          <span>Fast Setup</span>
          <span>•</span>
          <span>WhatsApp Friendly</span>
          <span>•</span>
          <span>24/7 Support</span>
        </div>
      </div>
    </section>
  );
};
