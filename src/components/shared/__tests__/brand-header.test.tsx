import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrandHeader } from '@/components/shared/BrandHeader';
import { Brand } from '@/lib/types';


// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Wallet: () => <div data-testid="wallet-icon" />,
  MessageSquare: () => <div data-testid="whatsapp-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  MapPin: () => <div data-testid="location-icon" />,
  Instagram: () => <div data-testid="instagram-icon" />,
  Facebook: () => <div data-testid="facebook-icon" />,
  Youtube: () => <div data-testid="youtube-icon" />,
  Link: () => <div data-testid="custom-link-icon" />,
  QrCode: () => <div data-testid="qrcode-icon" />,
}));

const MOCK_BRAND_FULL: Brand = {
  name: 'The Burger Den',
  logo_url: 'https://example.com/logo.png',
  cuisine: 'American',
  description: 'The best burgers in town.',
  payment_link: 'https://example.com/pay',
  whatsapp: '1112223333',
  contact: '4445556666',
  location_link: 'https://maps.google.com',
  instagram: 'https://instagram.com/burgerden',
  facebook: 'https://facebook.com/burgerden',
  youtube: 'https://youtube.com/burgerden',
  custom: 'https://example.com/custom',
};

const MOCK_BRAND_MINIMAL: Brand = {
  name: 'The Pizza Place',
  logo_url: 'https://example.com/pizza.png',
  cuisine: 'Italian',
  description: 'Authentic Italian pizza.',
  payment_link: '',
  whatsapp: '',
  contact: '',
};

describe('BrandHeader Component', () => {
  // Test Case: 1.3-R-01
  it('should render all information when provided with full data', () => {
    render(<BrandHeader brand={MOCK_BRAND_FULL} hasStatus={true} />);

    expect(screen.getByText('The Burger Den')).toBeInTheDocument();
    expect(screen.getByText('American')).toBeInTheDocument();
    expect(screen.getByText('The best burgers in town.')).toBeInTheDocument();
    const image = screen.getByRole('img', { name: /The Burger Den logo/i });
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toContain(encodeURIComponent('https://example.com/logo.png'));
    expect(screen.getByLabelText(/Payment Link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact on WhatsApp/i)).toBeInTheDocument();
  });

  // Test Case: 1.3-R-02
  it('should only render required information when optional data is missing', () => {
    render(<BrandHeader brand={MOCK_BRAND_MINIMAL} hasStatus={false} />);

    expect(screen.getByText('The Pizza Place')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Payment Link/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Contact on WhatsApp/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Instagram/i)).not.toBeInTheDocument();
  });

  // Test Case: 1.3-A-01
  it('should have correct aria-labels for all icon links', () => {
    render(<BrandHeader brand={MOCK_BRAND_FULL} hasStatus={false} />);

    expect(screen.getByLabelText('Payment Link')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact on WhatsApp')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Location on Map')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Facebook Page')).toBeInTheDocument();
    expect(screen.getByLabelText('YouTube Channel')).toBeInTheDocument();
    expect(screen.getByLabelText('Custom Link')).toBeInTheDocument();
  });

  // Test Case: 1.3-S-01
  it('should display a gradient ring when hasStatus is true', () => {
    const { container } = render(<BrandHeader brand={MOCK_BRAND_FULL} hasStatus={true} />);
    const logoContainer = container.querySelector('.status-ring-active');
    expect(logoContainer).toBeInTheDocument();
  });

  // Test Case: 1.3-S-02
  it('should not display a gradient ring when hasStatus is false', () => {
    const { container } = render(<BrandHeader brand={MOCK_BRAND_FULL} hasStatus={false} />);
    const logoContainer = container.querySelector('.status-ring-active');
    expect(logoContainer).not.toBeInTheDocument();
  });
});