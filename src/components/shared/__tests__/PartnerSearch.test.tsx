import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PartnerSearch } from '../PartnerSearch';
import '@testing-library/jest-dom';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

global.fetch = jest.fn();

describe('PartnerSearch', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders the search input', () => {
    render(<PartnerSearch />);
    expect(screen.getByPlaceholderText('Search vendors or dishes...')).toBeInTheDocument();
  });

  it('calls API and displays results', async () => {
    const mockResults = [
      { vendor_name: 'Vendor A', cuisine: 'Italian', vendor_slug: 'vendor-a' },
    ];
    (fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({ results: mockResults }) });

    render(<PartnerSearch />);
    const input = screen.getByPlaceholderText('Search vendors or dishes...');
    fireEvent.change(input, { target: { value: 'ven' } });

    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
  });
});
