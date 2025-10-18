
{/*
Project: Yumyum – Digital Menus for Street Food Vendors
Task: Build a High-Converting, Emotionally Resonant Landing Page
Goal: Maximize signups, sales, and profitability while maintaining human warmth and trust.

// ... (rest of the prompt)
*/}

import React from 'react';

import { HeroSection } from '@/components/features/landing/hero-section';
import { HowItWorksSection } from '@/components/features/landing/how-it-works-section';
import { WhyYumyumSection } from '@/components/features/landing/why-yumyum-section';
import { VisualDemoSection } from '@/components/features/landing/visual-demo-section';
import { VendorStoriesSection } from '@/components/features/landing/vendor-stories-section';
import { HowToJoinSection } from '@/components/features/landing/how-to-join-section';
import { FaqSection } from '@/components/features/landing/faq-section';
import { AboutSection } from '@/components/features/landing/about-section';
import { ConversionSection } from '@/components/features/landing/conversion-section';
import { FooterSection } from '@/components/features/landing/footer-section';

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <WhyYumyumSection />
      <VisualDemoSection />
      <VendorStoriesSection />
      <HowToJoinSection />
      <FaqSection />
      <AboutSection />
      <ConversionSection />
      <FooterSection />
    </div>
  );
}
