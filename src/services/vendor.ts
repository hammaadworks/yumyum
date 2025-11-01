import { createClient } from '@/lib/supabase/utils/client';
import { NO_ROWS_FOUND_ERROR_CODE } from '@/lib/constants';

import { VendorMapping } from '@/lib/types';

export async function checkVendorEmailExists(email: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/check-vendor-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      console.error('Error from check-vendor-email API:', response.statusText);
      return false;
    }

    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error('Network error checking vendor email:', error);
    return false;
  }
}

export async function getVendorMappingByUserId(
  userId: string,
): Promise<VendorMapping | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vendor_mappings')
    .select('*')
    .eq('auth_user_id', userId)
    .single();

  if (error && error.code !== NO_ROWS_FOUND_ERROR_CODE) {
    console.error('Error fetching vendor mapping by user ID:', error);
    return null;
  }

  return data as VendorMapping | null;
}

export async function getVendorMappingBySlug(
  slug: string,
): Promise<VendorMapping | null> {
  const supabase = createClient(); // This will be a server-side client in page.tsx
  const { data, error } = await supabase
    .from('vendor_mappings')
    .select('*')
    .eq('vendor_slug', slug)
    .single();

  if (error && error.code !== NO_ROWS_FOUND_ERROR_CODE) {
    console.error('Error fetching vendor mapping by slug:', error);
    return null;
  }

  return data as VendorMapping | null;
}
