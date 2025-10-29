import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient(); // Moved here
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: vendorMapping, error: vendorError } = await supabase
      .from('vendor_mappings')
      .select('vendor_slug')
      .eq('user_id', user.id)
      .single();

    if (vendorMapping) {
      return NextResponse.redirect(`${requestUrl.origin}/${vendorMapping.vendor_slug}/dashboard`);
    } else {
      console.error('Vendor mapping not found for user:', user.id, vendorError);
      // Redirect to a generic dashboard or error page if vendor_slug is not found
      return NextResponse.redirect(`${requestUrl.origin}/dashboard-error`);
    }
  }

  // Fallback redirect if user is not found
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}