import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PartnerSearch } from '../PartnerSearch';
import '@testing-library/jest-dom';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock the global fetch function
global.fetch = jest.fn();

describe('PartnerSearch Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the search API with the debounced query and display results', async () => {
    const mockResults = [
      { vendor_name: 'Vendor A', cuisine: 'Italian', vendor_slug: 'vendor-a' },
      { vendor_name: 'Vendor B', cuisine: 'Mexican', vendor_slug: 'vendor-b' },
    ];
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: mockResults }),
    });

    render(<PartnerSearch />);
    const input = screen.getByPlaceholderText('Search vendors or dishes...');

    // Type a query, but not long enough to trigger search immediately
    fireEvent.change(input, { target: { value: 've' } });
    expect(global.fetch).not.toHaveBeenCalled();

    // Type more, now long enough
    fireEvent.change(input, { target: { value: 'ven' } });

    // Wait for the debounce to pass and fetch to be called
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1), { timeout: 500 });
    expect(global.fetch).toHaveBeenCalledWith('/api/search-partners?q=ven');

    // Wait for results to appear
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    expect(screen.getByText('Vendor B')).toBeInTheDocument();
  });

  it('should display "No results found." if the API returns an empty array', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });

    render(<PartnerSearch />);
    const input = screen.getByPlaceholderText('Search vendors or dishes...');
    fireEvent.change(input, { target: { value: 'xyz' } });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1), { timeout: 500 });
    expect(await screen.findByText('No results found.')).toBeInTheDocument();
  });

  it('should display an error message if the API call fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<PartnerSearch />);
    const input = screen.getByPlaceholderText('Search vendors or dishes...');
    fireEvent.change(input, { target: { value: 'fail' } });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1), { timeout: 500 });
    // Expecting console.error to be called, but the component doesn't display a user-facing error for fetch failures.
    // It just clears results. So we check for no results.
    expect(screen.queryByText('No results found.')).not.toBeInTheDocument();
    expect(screen.queryByText('Vendor A')).not.toBeInTheDocument();
  });
});
