import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

const allFeatures = [
  { name: 'Google Sheets Backend', free: true, premium: true },
  { name: 'WhatsApp Integration', free: true, premium: true },
  { name: 'Basic Digital Menu', free: true, premium: true },
  { name: 'In-App Dashboard', free: false, premium: true },
  { name: 'Secure Login', free: false, premium: true },
  { name: 'Direct Image Uploads', free: false, premium: true },
  { name: 'Priority Support', free: false, premium: true },
];

export const TierComparison = () => {
  return (
    <section className="py-20 bg-[#FEF3E2]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#0B0B0B] mb-12">
          Find the Right Plan for You
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#0B0B0B]">
                Free Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-left">
                {allFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.free ? (
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
              <CardTitle className="text-2xl font-bold text-[#0B0B0B]">
                Premium Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-left">
                {allFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.premium ? (
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
        </div>
      </div>
    </section>
  );
};
