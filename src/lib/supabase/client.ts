import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_ACCT_1_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ACCT_1_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ACCT_1_URL environment variable.');
  }
  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ACCT_1_ANON_KEY environment variable.');
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}