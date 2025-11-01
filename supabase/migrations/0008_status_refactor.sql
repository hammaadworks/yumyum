-- MIGRATION FOR VENDOR-SPECIFIC DATABASES - STATUS REFACTOR

-- 1. ALTER the `status_item` table
ALTER TABLE public.status_item DROP COLUMN IF EXISTS active;
ALTER TABLE public.status_item DROP COLUMN IF EXISTS modify_time;
ALTER TABLE public.status_item ADD COLUMN IF NOT EXISTS imagekit_file_id text;

-- 2. Drop the old trigger for modify_time if it exists
DROP TRIGGER IF EXISTS handle_updated_at ON public.status_item;
