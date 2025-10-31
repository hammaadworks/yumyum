'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TopVendor } from '@/lib/types';

export function TopVendorsSection() {
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopVendors() {
      try {
        const response = await fetch('/top-vendors.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: TopVendor[] = await response.json();
        setTopVendors(data);
      } catch (err) {
        console.error("Failed to fetch top vendors:", err);
        setError("Could not load top vendors.");
      } finally {
        setLoading(false);
      }
    }

    fetchTopVendors();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-[#FEF3E2]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0B0B0B] mb-8">Top Vendors This Week</h2>
          <p>Loading top vendors...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-[#FEF3E2]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0B0B0B] mb-8">Top Vendors This Week</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (topVendors.length === 0) {
    return (
      <section className="py-20 bg-[#FEF3E2]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0B0B0B] mb-8">Top Vendors This Week</h2>
          <p>No top vendors to display this week.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#FEF3E2]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#0B0B0B] mb-8">Top Vendors This Week</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topVendors.map((vendor) => (
            <Link href={`/${vendor.vendor_slug}`} key={vendor.vendor_slug} passHref>
              <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-col items-center text-center">
                  <Image
                    src={vendor.logo_url}
                    alt={vendor.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover mb-4"
                  />
                  <CardTitle className="text-xl font-semibold text-[#0B0B0B]">
                    {vendor.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{vendor.cuisine}</p>
                </CardHeader>
                <CardContent>
                  {/* Additional content if needed */}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
