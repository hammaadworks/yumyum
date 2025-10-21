import React from 'react';
import { render } from '@testing-library/react';
import { PremiumMarketingSection } from '../PremiumMarketingSection';

jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useMotionTemplate: () => '',
  useMotionValue: () => ({
    set: jest.fn(),
  }),
}));

describe('PremiumMarketingSection', () => {
  it('renders without crashing', () => {
    render(<PremiumMarketingSection />);
  });
});
