import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// This function creates a Supabase client for a specific vendor project.
// It dynamically looks up the project's URL and anon key from environment variables
// based on the datastore_id from the vendor_mappings table.
export const createVendorClient = (datastore_id: string, cookieStore: ReadonlyRequestCookies) => {
  const supabaseUrl = process.env[`NEXT_PUBLIC_SUPABASE_${datastore_id.toUpperCase()}_URL`];
  const supabaseAnonKey = process.env[`NEXT_PUBLIC_SUPABASE_${datastore_id.toUpperCase()}_ANON_KEY`];

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(`Supabase configuration for datastore ${datastore_id} not found.`);
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async get(name: string) {
        return (await cookieStore).get(name)?.value;
      },
      async set(name: string, value: string, options: CookieOptions) {
        try {
          (await cookieStore).set({ name, value, ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
        }
      },
      async remove(name: string, options: CookieOptions) {
        try {
          (await cookieStore).set({ name, value: '', ...options });
        } catch (error) {
          // The `delete` method was called from a Server Component.
        }
      },
    },
  });
};
