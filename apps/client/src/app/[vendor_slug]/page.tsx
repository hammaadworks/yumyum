'use client';

import { useEffect, useState } from 'react';
import { getSheetIdForSlug, getBrandData, getDishesData } from '@/services/gsheets';
import { Brand, Dish } from '@/lib/types';
import { BrandHeader } from '@/components/shared/brand-header';
import { CategoryHighlights } from '@/components/features/categories/category-highlights';
import { ControlsBar } from '@/components/shared/controls-bar';
import { DishGrid } from '@/components/features/dishes/DishGrid';
import { useUiStore } from '@/store/use-ui.store';
import { ReelView } from '@/components/features/reel/ReelView';

export default function VendorPage({ params }: { params: { vendor_slug: string } }) {
  const { vendor_slug } = params;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isReelViewOpen = useUiStore((state) => state.isReelViewOpen);

  useEffect(() => {
    async function fetchData(slug: string) {
      try {
        const sheetId = await getSheetIdForSlug(slug);
        if (!sheetId) {
          setError('Vendor not found.');
          setLoading(false);
          return;
        }

        const brandData = await getBrandData(sheetId);
        const dishesData = await getDishesData(sheetId);

        setBrand(brandData);
        setDishes(dishesData);
      } catch (err) {
        console.error('Failed to load menu data:', err);
        setError('Failed to load menu data.');
      } finally {
        setLoading(false);
      }
    }

    fetchData(vendor_slug);
  }, [vendor_slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!brand) {
    return <div>Could not load brand information.</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <BrandHeader brand={brand} />
      <div className="my-8">
        <CategoryHighlights dishes={dishes} />
      </div>
      <ControlsBar />
      <DishGrid dishes={dishes} />

      {isReelViewOpen && <ReelView dishes={dishes} />}
    </main>
  );
}
