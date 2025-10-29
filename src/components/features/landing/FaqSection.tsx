import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Do I need to download anything?',
    answer: 'No. Yumyum works using WhatsApp & Google Sheets.',
  },
  {
    question: 'Is it free?',
    answer: 'Free to start. Pay only when you grow.',
  },
  {
    question: 'Can I use my own WhatsApp number?',
    answer: 'Yes. Orders go directly to your business number.',
  },
  {
    question: 'Can I change my menu anytime?',
    answer: 'Instantly. Just edit your Google Sheet.',
  },
  {
    question: 'Does it support my local language?',
    answer: 'Yes — Yumyum supports all Indian languages.',
  },
  {
    question: 'Who built Yumyum?',
    answer: 'A small, passionate team that loves street food and simplicity.',
  },
];

export const FaqSection = () => {
  return (
    <section className="py-20 bg-[#FEF3E2]">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#0B0B0B]">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white px-4 rounded-lg mb-2"
            >
              <AccordionTrigger className="text-[#0B0B0B]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
