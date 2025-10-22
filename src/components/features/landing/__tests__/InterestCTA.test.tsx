import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InterestCTA } from '../InterestCTA';
import * as gtag from '@/lib/gtag';
import {
  WHATSAPP_INTEREST_MESSAGE,
  WHATSAPP_NUMBER,
} from '@/lib/constants';

// Mock the gtag event function
jest.mock('@/lib/gtag', () => ({
  event: jest.fn(),
}));

describe('InterestCTA', () => {
  // Mock window.open
  const mockWindowOpen = jest.fn();
  beforeAll(() => {
    global.open = mockWindowOpen;
  });

  beforeEach(() => {
    // Clear mock history before each test
    (gtag.event as jest.Mock).mockClear();
    mockWindowOpen.mockClear();
  });

  it('renders a button with the correct aria-label', () => {
    render(<InterestCTA />);
    const button = screen.getByRole('button', { name: /Chat on WhatsApp/i });
    expect(button).toBeInTheDocument();
  });

  it('fires the premium_cta_clicked GA event and opens the correct WhatsApp URL on click', () => {
    render(<InterestCTA />);
    const button = screen.getByRole('button', { name: /Chat on WhatsApp/i });
    fireEvent.click(button);

    // Check if GA event was called
    expect(gtag.event).toHaveBeenCalledWith('premium_cta_clicked', {
      event_category: 'engagement',
      event_label: 'Premium CTA Clicked',
    });

    // Check if window.open was called with the correct URL
    const encodedMessage = encodeURIComponent(WHATSAPP_INTEREST_MESSAGE);
    const expectedUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    expect(mockWindowOpen).toHaveBeenCalledWith(expectedUrl, '_blank');
  });
});
