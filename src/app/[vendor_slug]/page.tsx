'use client';

import { useEffect, useState } from 'react';
import { getSheetIdForSlug, getBrandData, getDishesData, getStatusData } from '@/services/gsheets';
import { Brand, Dish, Status } from '@/lib/types';
import { BrandHeader } from '@/components/shared/brand-header';
import { CategoryHighlights } from '@/components/features/categories/category-highlights';
import { ControlsBar } from '@/components/shared/controls-bar';
import { DishGrid } from '@/components/features/dishes/dish-grid';
import { useUIStore } from '@/store/use-ui.store';
import { ReelView } from '@/components/features/reel/reel-view';

/**
 * Render the vendor menu page for a given vendor slug.
 *
 * Fetches brand and dish data for the provided route param and renders the appropriate UI:
 * shows a loading indicator while fetching, an error message on failure, a fallback if brand
 * data is missing, or the full menu view with BrandHeader, CategoryHighlights, ControlsBar,
 * DishGrid, and a conditional ReelView when the UI store enables it.
 *
 * @param params - Route parameters object
 * @param params.vendor_slug - The vendor slug used to resolve the sheet ID and load brand and dishes
 * @returns The JSX element for the vendor page
 */
import { QRCodeModal } from '@/components/shared/QRCodeModal';

// ... (imports)

export default function VendorPage({ params }: { params: { vendor_slug: string } }) {
  // ... (state and useEffect)

  // ... (other code)

  return (
    <main className="container mx-auto p-4">
      <BrandHeader brand={brand} hasStatus={!!status && status.length > 0} />
      <div className="my-8">
        <CategoryHighlights dishes={dishes} onCategorySelect={handleSelectCategory} />
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

      {brand && <CartSummary open={isCartSummaryOpen} onOpenChange={closeCartSummary} brand={brand} />}
      {status && <StatusViewer status={status} />}
      <QRCodeModal />
    </main>
  );
}

  