-- MIGRATION FOR VENDOR-SPECIFIC DATABASES

-- 1. ALTER the `brand` table
-- Drop existing RLS policies and table constraints before altering
DROP POLICY IF EXISTS "Vendors can view their own brand" ON public.brand;
-- ... drop other brand policies ...
ALTER TABLE public.brand DROP CONSTRAINT IF EXISTS brand_vendor_id_fkey;

ALTER TABLE public.brand RENAME COLUMN vendor_id TO auth_user_id;
ALTER TABLE public.brand ADD COLUMN modify_time timestamp with time zone DEFAULT now() NOT NULL;

-- Recreate foreign key to auth.users
ALTER TABLE public.brand ADD CONSTRAINT brand_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. ALTER the `dishes` table
ALTER TABLE public.dishes RENAME COLUMN vendor_id TO brand_id;
-- Drop old foreign key if it exists
ALTER TABLE public.dishes DROP CONSTRAINT IF EXISTS dishes_vendor_id_fkey;
-- Add new foreign key to brand table
ALTER TABLE public.dishes ADD CONSTRAINT dishes_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand(id) ON DELETE CASCADE;

ALTER TABLE public.dishes ADD COLUMN create_time timestamp with time zone DEFAULT now() NOT NULL;
ALTER TABLE public.dishes ADD COLUMN modify_time timestamp with time zone DEFAULT now() NOT NULL;

-- 3. RENAME `status` table to `status_item` and ALTER
ALTER TABLE public.status RENAME TO status_item;
ALTER TABLE public.status_item RENAME COLUMN vendor_id TO brand_id;
-- Drop old foreign key if it exists
ALTER TABLE public.status_item DROP CONSTRAINT IF EXISTS status_vendor_id_fkey;
-- Add new foreign key to brand table
ALTER TABLE public.status_item ADD CONSTRAINT status_item_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand(id) ON DELETE CASCADE;

ALTER TABLE public.status_item ADD COLUMN active boolean DEFAULT true NOT NULL;
ALTER TABLE public.status_item ADD COLUMN create_time timestamp with time zone DEFAULT now() NOT NULL;
ALTER TABLE public.status_item ADD COLUMN modify_time timestamp with time zone DEFAULT now() NOT NULL;

-- 4. CREATE a function to automatically update `modify_time`
-- This function is generic and can be reused.
CREATE OR REPLACE FUNCTION public.update_modify_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modify_time = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. CREATE triggers for all tables
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.brand
  FOR EACH ROW EXECUTE PROCEDURE public.update_modify_time();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.dishes
  FOR EACH ROW EXECUTE PROCEDURE public.update_modify_time();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.status_item
  FOR EACH ROW EXECUTE PROCEDURE public.update_modify_time();

-- 6. RE-APPLY RLS policies
-- RLS for brand table
ALTER TABLE public.brand ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendors can manage their own brand" ON public.brand FOR ALL USING (auth.uid() = auth_user_id);

-- RLS for dishes table (relies on join to brand)
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendors can manage their own dishes" ON public.dishes FOR ALL USING (
  (EXISTS ( SELECT 1
   FROM brand
  WHERE ((brand.id = dishes.brand_id) AND (brand.auth_user_id = auth.uid()))))
);

-- RLS for status_item table (relies on join to brand)
ALTER TABLE public.status_item ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendors can manage their own status items" ON public.status_item FOR ALL USING (
  (EXISTS ( SELECT 1
   FROM brand
  WHERE ((brand.id = status_item.brand_id) AND (brand.auth_user_id = auth.uid()))))
);
