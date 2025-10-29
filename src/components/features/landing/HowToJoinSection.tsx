import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/utils';
import { WHATSAPP_NUMBER, WHATSAPP_INTEREST_MESSAGE } from '@/lib/constants';

export const HowToJoinSection = () => {
  return (
    <section className="py-20 bg-[#FEF3E2]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#0B0B0B]">
          Start Your Yumyum Menu in 2 Minutes.
        </h2>
        <p className="text-xl text-muted-foreground mt-2">
          All you need is your phone, Google Sheets, and your passion.
        </p>
        <div className="flex justify-center mt-8">
          <ol className="text-left space-y-4 text-[#0B0B0B]">
            <li>1. Send us your menu on WhatsApp.</li>
            <li>2. We set up your Yumyum digital menu instantly.</li>
            <li>3. Share your QR or link with customers.</li>
          </ol>
        </div>
        <a
          href={generateWhatsAppLink(
            WHATSAPP_NUMBER,
            WHATSAPP_INTEREST_MESSAGE,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="lg"
            className="mt-8 bg-[#FAB12F] text-[#0B0B0B] hover:bg-[#FAB12F]/90"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Join on WhatsApp
          </Button>
        </a>
        <p className="text-sm text-muted-foreground mt-4">
          No fees to start. No app downloads. Cancel anytime.
        </p>
      </div>
    </section>
  );
};
