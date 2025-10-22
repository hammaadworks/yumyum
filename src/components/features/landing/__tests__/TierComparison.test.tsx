import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { TierComparison } from '@/components/features/landing/TierComparison';

describe('TierComparison', () => {
  it('renders correct content for the free tier', () => {
    render(<TierComparison />);
    const freeTierCard = screen.getByText('Free Tier').closest('div') as HTMLElement;
    const list = within(freeTierCard).getByRole('list');
    expect(list).toHaveTextContent('Google Sheets Backend');
    expect(list).toHaveTextContent('WhatsApp Integration');
    expect(list).not.toHaveTextContent('In-App Dashboard');
  });

  it('renders correct content for the premium tier', () => {
    render(<TierComparison />);
    const premiumTierCard = screen.getByText('Premium Tier').closest('div') as HTMLElement;
    const list = within(premiumTierCard).getByRole('list');
    expect(list).toHaveTextContent('In-App Dashboard');
    expect(list).toHaveTextContent('Secure Login');
    expect(list).toHaveTextContent('Direct Image Uploads');
  });
});
