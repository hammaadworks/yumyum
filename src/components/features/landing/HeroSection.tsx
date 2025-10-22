import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="text-center py-20 bg-[#FEF3E2]">
      <h1 className="text-5xl font-bold text-[#0B0B0B]">
        Turn Your Street Food Into a Digital Menu — Instantly.
      </h1>
      <p className="text-xl text-muted-foreground mt-4">
        Use Google Sheets + WhatsApp to sell more — no apps, no stress.
      </p>
      <div className="mt-8">
        {/* Placeholder for visual */}
        <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
      </div>
      <Button
        size="lg"
        className="mt-8 bg-[#FAB12F] text-[#0B0B0B] hover:bg-[#FAB12F]/90"
      >
        Create My Menu
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
      <p className="text-sm text-muted-foreground mt-4">
        Powered by Google Sheets • WhatsApp Integrated • No Downloads.
      </p>
    </section>
  );
};
