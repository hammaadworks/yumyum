import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Check, X } from 'lucide-react';

const freeFeatures = [
  { name: 'Google Sheets Backend', included: true },
  { name: 'WhatsApp Integration', included: true },
  { name: 'Basic Digital Menu', included: true },
  { name: 'In-App Dashboard', included: false },
  { name: 'Secure Login', included: false },
  { name: 'Direct Image Uploads', included: false },
  { name: 'Priority Support', included: false },
];

const premiumFeatures = [
  { name: 'Google Sheets Backend', included: true },
  { name: 'WhatsApp Integration', included: true },
  { name: 'Basic Digital Menu', included: true },
  { name: 'In-App Dashboard', included: true },
  { name: 'Secure Login', included: true },
  { name: 'Direct Image Uploads', included: true },
  { name: 'Priority Support', included: true },
];

export const TierComparison = () => {
  return (
    <section className="py-20 bg-[#FEF3E2]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#0B0B0B] mb-12">Find the Right Plan for You</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#0B0B0B]">Free Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-left">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="text-green-500 w-5 h-5" />
                    ) : (
                      <X className="text-red-500 w-5 h-5" />
                    )}
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-[#FAB12F]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#0B0B0B]">Premium Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-left">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="text-green-500 w-5 h-5" />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
