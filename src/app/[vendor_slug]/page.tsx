'use client';

import { CartSummary } from '@/components/features/cart/CartSummary';
import { CategoryHighlights } from '@/components/features/categories/CategoryHighlights';
import { DishGrid } from '@/components/features/dishes/DishGrid';
import { ReelView } from '@/components/features/reel/ReelView';
import { StatusViewer } from '@/components/features/status/StatusViewer';
import { BrandHeader } from '@/components/shared/BrandHeader';
import { ControlsBar } from '@/components/shared/ControlsBar';
import { GlobalCart } from '@/components/shared/GlobalCart';
import { QRCodeModal } from '@/components/shared/QRCodeModal';
import { Brand, Dish, Status } from '@/lib/types';
import {
  getBrandData,
  getDishesData,
  getSheetIdForSlug,
  getStatusData,
} from '@/services/gsheets';
import { useUIStore } from '@/store/use-ui.store';
import { useEffect, useState } from 'react';

// ... (imports)

export default function VendorPage({
  params,
}: {
  params: { vendor_slug: string };
}) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const { isReelViewOpen, closeReelView, activeIndex, setActiveIndex } =
    useUIStore();
  const { isCartSummaryOpen, closeCartSummary } = useUIStore();

  // Computed values
  const categories = Array.from(new Set(dishes.map((dish) => dish.category)));

  useEffect(() => {
    async function fetchData() {
      try {
        const sheetId = await getSheetIdForSlug(params.vendor_slug);
        if (!sheetId) {
          setError('Vendor not found');
          setLoading(false);
          return;
        }

        const [brandData, dishesData, statusData] = await Promise.all([
          getBrandData(sheetId),
          getDishesData(sheetId),
          getStatusData(sheetId),
        ]);

        if (!brandData) {
          setError('Could not load brand data');
          setLoading(false);
          return;
        }

        setBrand(brandData);
        setDishes(dishesData);
        setStatus(statusData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading vendor data:', err);
        setError('Failed to load menu data');
        setLoading(false);
      }
    }

    fetchData();
  }, [params.vendor_slug]);

  const handleSelectCategory = (category: string) => {
    const dishIndex = dishes.findIndex((d) => d.category === category);
    if (dishIndex >= 0) {
      setActiveIndex(dishIndex);
    }
  };

  const handleSelectDish = (dish: Dish) => {
    const dishIndex = dishes.findIndex((d) => d.id === dish.id);
    if (dishIndex >= 0) {
      setActiveIndex(dishIndex);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || 'Could not load menu'}
      </div>
    );
  }

  return (
    <>
      <GlobalCart />
      <main className="container mx-auto p-4">
        <BrandHeader brand={brand} hasStatus={!!status && status.length > 0} />
        <div className="my-8">
          <CategoryHighlights
            dishes={dishes}
            onCategorySelect={handleSelectCategory}
          />
        </div>
        <ControlsBar />
        <DishGrid dishes={dishes} onDishSelect={handleSelectDish} />

        <ReelView
          dishes={dishes}
          categories={categories}
          activeIndex={activeIndex}
          isReelViewOpen={isReelViewOpen}
          closeReelView={closeReelView}
          setActiveIndex={setActiveIndex}
        />

        {brand && (
          <CartSummary
            open={isCartSummaryOpen}
            onOpenChange={closeCartSummary}
            brand={brand}
          />
        )}
        {status && <StatusViewer status={status} />}
        <QRCodeModal />
      </main>
    </>
  );
}
