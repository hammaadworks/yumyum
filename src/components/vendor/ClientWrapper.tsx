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
import { Brand, Dish, Status, VendorMapping } from '@/lib/types';
import { useUIStore } from '@/store/use-ui.store';

interface ClientWrapperProps {
  vendorMapping: VendorMapping;
  brand: Brand;
  dishes: Dish[];
  status: Status | null;
  user: any; // Adjust type as per Supabase user type
}

export function ClientWrapper({
  brand,
  dishes,
  status,
  user,
  vendorMapping,
}: ClientWrapperProps) {
  // UI State
  const { isReelViewOpen, closeReelView, activeIndex, setActiveIndex } =
    useUIStore();
  const { isCartSummaryOpen, closeCartSummary } = useUIStore();

  // Computed values
  const categories = Array.from(new Set(dishes.map((dish) => dish.category)));

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
        {status && <StatusViewer status={status} datastore_type={vendorMapping.datastore_type} />}
        <QRCodeModal />
      </main>
    </>
  );
}
