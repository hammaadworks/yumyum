import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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
  const mockWindowOpen = jest.fn();
  let locationSpy: jest.SpyInstance;

  beforeAll(() => {
    // Mock window.open for the fallback
    global.open = mockWindowOpen;
    // Retain the original window.location object but allow spying on its properties
    const originalLocation = window.location;
    locationSpy = jest.spyOn(window, 'location', 'get');
    // @ts-ignore
    delete window.location;
    window.location = { ...originalLocation, href: '' };
  });

  beforeEach(() => {
    // Clear mock history before each test
    (gtag.event as jest.Mock).mockClear();
    mockWindowOpen.mockClear();
    window.location.href = ''; // Reset href before each test
    jest.useFakeTimers(); // Use fake timers for setTimeout
  });

  afterEach(() => {
    jest.useRealTimers(); // Restore real timers
  });

  afterAll(() => {
    locationSpy.mockRestore(); // Clean up spy
  });

  it('renders a button with the correct aria-label', () => {
    render(<InterestCTA />);
    const button = screen.getByRole('button', { name: /Chat on WhatsApp/i });
    expect(button).toBeInTheDocument();
  });

  it('attempts deep link, fires GA event, and sets up fallback to wa.me URL on click', () => {
    render(<InterestCTA />);
    const button = screen.getByRole('button', { name: /Chat on WhatsApp/i });
    fireEvent.click(button);

    // 1. Check if GA event was called immediately
    expect(gtag.event).toHaveBeenCalledWith('premium_cta_clicked', {
      event_category: 'engagement',
      event_label: 'Premium CTA Clicked',
    });

    // 2. Check if the deep link was attempted immediately
    const encodedMessage = encodeURIComponent(WHATSAPP_INTEREST_MESSAGE);
    const deepLinkUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
    expect(window.location.href).toBe(deepLinkUrl);

    // 3. Fast-forward timers to trigger the fallback
    act(() => {
      jest.advanceTimersByTime(800);
    });

    // 4. Check if the fallback to window.open was called
    const fallbackUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    expect(mockWindowOpen).toHaveBeenCalledWith(fallbackUrl, '_blank');
    expect(mockWindowOpen).toHaveBeenCalledTimes(1);
  });
});
