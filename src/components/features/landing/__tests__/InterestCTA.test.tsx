import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { InterestCTA } from '@/components/features/landing/InterestCTA';
import * as gtag from '@/lib/gtag';
import { WHATSAPP_INTEREST_MESSAGE, WHATSAPP_NUMBER } from '@/lib/constants';

jest.mock('@/lib/gtag', () => ({
  event: jest.fn(),
}));

describe('InterestCTA', () => {
  const mockWindowOpen = jest.fn();

  beforeAll(() => {
    // Mock window.open
    (globalThis as any).open = mockWindowOpen;

    // Mock window.location.href
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    window.location.href = '';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the button', () => {
    render(<InterestCTA />);
    expect(
      screen.getByRole('button', { name: /Chat on WhatsApp/i })
    ).toBeInTheDocument();
  });

  it('fires GA event and handles deep link + fallback', () => {
    render(<InterestCTA />);
    const button = screen.getByRole('button', { name: /Chat on WhatsApp/i });

    fireEvent.click(button);

    // Analytics event fired
    expect(gtag.event).toHaveBeenCalledWith('premium_cta_clicked', {
      event_category: 'engagement',
      event_label: 'Premium CTA Clicked',
    });

    // Deep link applied
    const encodedMessage = encodeURIComponent(WHATSAPP_INTEREST_MESSAGE);
    expect(window.location.href).toBe(
      `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`
    );

    // Fallback after timeout
    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(mockWindowOpen).toHaveBeenCalledWith(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`,
      '_blank'
    );
  });
});
