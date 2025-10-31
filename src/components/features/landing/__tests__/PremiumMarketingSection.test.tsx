import React from 'react';
import { render, screen } from '@testing-library/react';
import { PremiumMarketingSection } from '@/components/features/landing/PremiumMarketingSection';

jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  useMotionTemplate: () => '',
  useMotionValue: () => ({
    set: jest.fn(),
  }),
}));

describe('PremiumMarketingSection', () => {
  it('renders its marketing content', () => {
    render(<PremiumMarketingSection />);
    const heading = screen.getByRole('heading', {
      name: /Go Premium, Unlock Growth/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
