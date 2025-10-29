import { createClient } from '@/lib/supabase/client';
import { NO_ROWS_FOUND_ERROR_CODE } from '@/lib/constants';

export async function checkVendorEmailExists(email: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vendor_mappings')
    .select('id')
    .eq('email', email)
    .single();

  if (error && error.code !== NO_ROWS_FOUND_ERROR_CODE) { // PGRST116 is "No rows found"
    console.error('Error checking vendor email:', error);
    return false;
  }

  return !!data;
}