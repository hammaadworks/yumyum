"use client";

import React from 'react';
import { MagicCard } from '@/components/ui/MagicCard';
import { ShineBorder } from '@/components/ui/ShineBorder';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export const PremiumMarketingSection = () => {
  return (
    <section className="py-20 bg-[#FEF3E2]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#0B0B0B] mb-4">Go Premium, Unlock Growth</h2>
        <p className="text-xl text-muted-foreground mt-2 mb-12">
          Step up from Google Sheets to a powerful, in-app dashboard. Manage everything in one place.
        </p>

          <MagicCard
            className="w-full max-w-4xl mx-auto p-8"
            gradientColor="#000000"
            gradientSize={250}
          >
            <div className="text-left text-white">
              <h3 className="text-3xl font-bold mb-4">In-App Management Dashboard</h3>
              <p className="text-lg text-neutral-400 mb-6">
                Full control over your menu, brand, and daily status with an intuitive dashboard. No more switching between apps.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <ArrowRight className="text-[#FAB12F] w-5 h-5" />
                  <span>Secure, passwordless login.</span>
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="text-[#FAB12F] w-5 h-5" />
                  <span>Real-time CRUD for your dishes and profile.</span>
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="text-[#FAB12F] w-5 h-5" />
                  <span>Direct image uploads via Cloudinary.</span>
                </li>
              </ul>
              <ShineBorder
                className="w-fit"
                shineColor={["#FAB12F", "#FFC857"]}
              >
                <Button className="bg-transparent">
                  Explore Premium Features
                </Button>
              </ShineBorder>
            </div>
          </MagicCard>

      </div>
    </section>
  );
};
