import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InterestCTA } from '../InterestCTA';
import * as gtag from '@/lib/gtag';

describe('InterestCTA', () => {
  it('renders a button with the text "Interested?"', () => {
    render(<InterestCTA />);
    const button = screen.getByRole('button', { name: /Interested?/i });
    expect(button).toBeInTheDocument();
  });

  it('fires the premium_cta_clicked GA event on click', () => {
    const eventSpy = jest.spyOn(gtag, 'event');
    render(<InterestCTA />);
    const button = screen.getByRole('button', { name: /Interested?/i });
    fireEvent.click(button);
    expect(eventSpy).toHaveBeenCalledWith('premium_cta_clicked', {
      event_category: 'engagement',
      event_label: 'Premium CTA Clicked',
    });
  });
});
