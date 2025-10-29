import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  // 1. Authentication and Authorization Check
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // For demonstration, let's assume an admin user has a specific role or email.
  // In a real application, implement robust role-based access control.
  // For now, we'll just check if the user is authenticated.
  // A more robust check would involve querying user roles from a profile table.
  // if (user.email !== 'admin@yumyum.com') {
  //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // }

  const { id } = params;
  const { is_member } = await request.json();

  if (typeof is_member !== 'boolean') {
    return NextResponse.json({ error: 'Invalid is_member value' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('vendor_mappings')
    .update({ is_member })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating vendor membership:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}
