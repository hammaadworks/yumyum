'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { useDebounce } from '@/hooks/use-debounce';

interface SearchResult {
  vendor_name: string;
  cuisine: string;
  vendor_slug: string;
}

export function PartnerSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      console.log('Searching for:', debouncedQuery);
      setLoading(true);
      try {
        const response = await fetch(`/api/search-partners?q=${debouncedQuery}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [debouncedQuery]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search vendors or dishes..."
        className="w-full p-3 rounded-lg border-2 border-amber-300 focus:outline-none focus:border-amber-500 text-amber-900 bg-white"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && (
        <div className="absolute z-10 w-full bg-white shadow-lg rounded-b-lg p-2 text-center">
          Loading...
        </div>
      )}
      {results.length > 0 && query.length >= 2 && !loading && (
        <ul className="absolute z-10 w-full bg-white shadow-lg rounded-b-lg mt-1 max-h-60 overflow-y-auto">
          {results.map((result) => (
            <li
              key={result.vendor_slug}
              className="p-3 hover:bg-amber-100 cursor-pointer border-b border-amber-200 last:border-b-0"
            >
              <Link href={`/${result.vendor_slug}`}>
                <p className="font-semibold text-amber-900">
                  {result.vendor_name}
                </p>
                <p className="text-sm text-amber-700">{result.cuisine}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {results.length === 0 && query.length >= 2 && !loading && (
        <div className="absolute z-10 w-full bg-white shadow-lg rounded-b-lg p-3 text-center text-amber-700">
          No results found.
        </div>
      )}
    </div>
  );
}
