
import React from 'react';
import { CheckCircle } from 'lucide-react';

const features = [
  'No app or website required',
  'Works on any phone',
  'Real-time updates via Sheets',
  'QR-ready sharing',
  'Local language friendly',
  'Fast setup (2 minutes)',
  'Feedback via WhatsApp',
];

export const WhyYumyumSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold">Why Yumyum?</h2>
        <p className="text-xl text-muted-foreground mt-2">You cook, we handle the tech.</p>
        <div className="grid md:grid-cols-2 gap-8 mt-12 text-left max-w-2xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
