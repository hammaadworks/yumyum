import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { TierComparison } from '@/components/features/landing/TierComparison';

describe.skip('TierComparison', () => {
  it('renders correct content for the free tier', () => {
    render(<TierComparison />);
    expect(screen.getByText('Google Sheets Backend')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp Integration')).toBeInTheDocument();
    expect(screen.queryByText('In-App Dashboard')).not.toBeInTheDocument();
  });

  it('renders correct content for the premium tier', () => {
    render(<TierComparison />);
    expect(screen.getByText('In-App Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Secure Login')).toBeInTheDocument();
    expect(screen.getByText('Direct Image Uploads')).toBeInTheDocument();
  });
});
