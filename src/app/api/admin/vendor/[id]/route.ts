import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/utils/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Authentication and Authorization Check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // For demonstration, let's assume an admin user has a specific role or email.
  // In a real application, implement robust role-based access control.
  // For now, we'll just check if the user is authenticated.
  // A more robust check would involve querying user roles from a profile table.
  if (user.user_metadata.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const resolvedParams = await context.params;
  const { id } = resolvedParams;
  const { is_member } = await request.json();

  if (typeof is_member !== 'boolean') {
    return NextResponse.json(
      { error: 'Invalid is_member value' },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from('vendor_mappings')
    .update({ is_member })
    .eq('id', id);

  if (error) {
    console.error('Error updating vendor membership:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}
