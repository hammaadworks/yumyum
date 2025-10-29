import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/utils/admin';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return new NextResponse(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createAdminClient();

  // Call the RPC function to get user ID by email
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_id_by_email', { user_email: email });

  if (rpcError || !rpcData || rpcData.length === 0) {
    return NextResponse.json({ exists: false });
  }

  const userId = rpcData[0].id;

  // Check if a vendor mapping exists for this user_id
  const { data: vendorData, error: vendorError } = await supabase
    .from('vendor_mappings')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (vendorError && vendorError.code !== 'PGRST116') { // PGRST116 is "No rows found"
    console.error('Error checking vendor mapping:', vendorError);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return NextResponse.json({ exists: !!vendorData });
}