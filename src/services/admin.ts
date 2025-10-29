import { createClient } from '@/lib/supabase/utils/client';
import { ADMIN_ROLE } from '@/lib/constants';

export async function updateVendorMembership(vendorId: string, isMember: boolean): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: userError?.message || 'User not authenticated.' };
  }

  // Assuming admin role is stored in user_metadata
  if (user.user_metadata.role !== ADMIN_ROLE) {
    return { success: false, error: 'User not authorized.' };
  }

  const { data, error } = await supabase
    .from('vendor_mappings')
    .update({ is_member: isMember })
    .eq('user_id', vendorId);

  if (error) {
    console.error('Error updating vendor membership:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
