
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, FileText, MessageSquare } from 'lucide-react';

export const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-[#FEF3E2]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#0B0B0B]">How It Works</h2>
        <p className="text-muted-foreground mt-2">3 Simple Steps to Sell Online</p>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <Card className="bg-white">
            <CardHeader>
              <Sheet className="w-12 h-12 mx-auto text-[#FAB12F]" />
              <CardTitle className="mt-4 text-[#0B0B0B]">1. Add Your Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Add your menu to a simple Google Sheet. No complex software to learn.</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <FileText className="w-12 h-12 mx-auto text-[#FAB12F]" />
              <CardTitle className="mt-4 text-[#0B0B0B]">2. Get Your Digital Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Yumyum instantly turns your sheet into a beautiful, shareable menu.</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <MessageSquare className="w-12 h-12 mx-auto text-[#FAB12F]" />
              <CardTitle className="mt-4 text-[#0B0B0B]">3. Start Selling</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Customers browse and order directly from your menu to your WhatsApp.</p>
            </CardContent>
          </Card>
        </div>
        <Button variant="outline" className="mt-12 border-[#FAB12F] text-[#FAB12F] hover:bg-[#FAB12F] hover:text-white">Try Demo Menu</Button>
      </div>
    </section>
  );
};
