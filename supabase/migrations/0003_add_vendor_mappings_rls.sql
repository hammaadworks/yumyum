-- Enable Row Level Security for public.vendor_mappings
ALTER TABLE public.vendor_mappings ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to view and update their own vendor_mappings
CREATE POLICY "Vendors can view and update their own mappings."
ON public.vendor_mappings FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);