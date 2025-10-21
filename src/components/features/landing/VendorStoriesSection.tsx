
import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';

const testimonials = [
  {
    quote: "I never thought I’d have a digital menu. My customers love scanning and ordering!",
    name: "Rekha",
    stall: "Chaat Corner, Mumbai",
    image: "/placeholder.svg",
  },
  {
    quote: "Yumyum is so simple to use. I can update my menu in seconds from my phone.",
    name: "Ali",
    stall: "Kebab House, Delhi",
    image: "/placeholder.svg",
  },
  {
    quote: "The best part is the direct orders on WhatsApp. No more commissions to aggregators!",
    name: "Sandeep",
    stall: "Dosa Point, Bangalore",
    image: "/placeholder.svg",
  },
];

export const VendorStoriesSection = () => {
  return (
    <section className="py-20 bg-[#FEF3E2]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#0B0B0B]">From Vendors Like You</h2>
        <p className="text-muted-foreground mt-2">100+ local stalls are growing with Yumyum.</p>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="pt-6">
                <p className="italic text-[#0B0B0B]">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-4 mt-4">
                  <Image src={testimonial.image} alt={testimonial.name} width={48} height={48} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-[#0B0B0B]">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.stall}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
