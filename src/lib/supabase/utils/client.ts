import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_ACCT_1_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ACCT_1_ANON_KEY!,
  );
