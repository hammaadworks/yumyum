import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/utils/server';
import { createVendorClient } from '@/lib/supabase/utils/vendor';
import { cookies } from 'next/headers';
import { getBrandData, getDishesData } from '@/services/gsheets';

interface SearchResult {
  vendor_name: string;
  cuisine: string;
  vendor_slug: string;
}

/**
 * This API route performs a fuzzy search for vendors and their dishes.
 * It queries both Supabase and Google Sheets data sources concurrently.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const cookieStore = await cookies();
  const primarySupabase = createClient(cookieStore);
  const lowerCaseQuery = query.toLowerCase();

  // Fetch all vendor mappings first
  const { data: allVendorMappings, error: mappingError } = await primarySupabase
    .from('vendor_mappings')
    .select('*');

  if (mappingError) {
    console.error("Error fetching vendor mappings:", mappingError);
    return NextResponse.json({ results: [] });
  }

  const supabaseVendorMappings = allVendorMappings.filter(m => m.datastore_type === 'supabase');
  const gsheetsVendorMappings = allVendorMappings.filter(m => m.datastore_type === 'gsheets');

  // --- Perform searches in parallel ---
  const searchPromises: Promise<SearchResult[]>[] = [];

  // 1. Search Supabase vendors
  if (supabaseVendorMappings.length > 0) {
    const supabaseSearch = (async (): Promise<SearchResult[]> => {
      try {
        // In a real-world scenario with many vendors, this would be a single RPC call
        // to a function that performs the JOIN and search on the backend.
        // For now, we iterate, but this is more efficient than fetching all data first.
        const promises = supabaseVendorMappings.map(async (mapping) => {
          const vendorSupabase = createVendorClient(mapping.datastore_id, cookieStore);
          const { data: brand } = await vendorSupabase.from('brand').select('name, cuisine').ilike('name', `%${query}%`).single();
          if (brand) {
            return { vendor_name: brand.name, cuisine: brand.cuisine, vendor_slug: mapping.vendor_slug };
          }
          return null;
        });
        return (await Promise.all(promises)).filter((r): r is SearchResult => r !== null);
      } catch (e) {
        console.error('Error searching Supabase vendors:', e);
        return [];
      }
    })();
    searchPromises.push(supabaseSearch);
  }

  // 2. Search Google Sheets vendors
  if (gsheetsVendorMappings.length > 0) {
    const gsheetsSearch = (async (): Promise<SearchResult[]> => {
      const promises = gsheetsVendorMappings.map(async (mapping) => {
        try {
          const brandData = await getBrandData(mapping.datastore_id);
          if (brandData && (brandData.name.toLowerCase().includes(lowerCaseQuery) || brandData.cuisine.toLowerCase().includes(lowerCaseQuery))) {
            return { vendor_name: brandData.name, cuisine: brandData.cuisine, vendor_slug: mapping.vendor_slug };
          }
          const dishesData = await getDishesData(mapping.datastore_id);
          if (dishesData.some(d => d.name.toLowerCase().includes(lowerCaseQuery))) {
            return { vendor_name: brandData!.name, cuisine: brandData!.cuisine, vendor_slug: mapping.vendor_slug };
          }
          return null;
        } catch (e) {
          console.error(`Error searching G-Sheets vendor ${mapping.vendor_slug}:`, e);
          return null;
        }
      });
      return (await Promise.all(promises)).filter((r): r is SearchResult => r !== null);
    })();
    searchPromises.push(gsheetsSearch);
  }

  // Consolidate results
  const allResults = (await Promise.all(searchPromises)).flat();
  const uniqueResults = Array.from(new Map(allResults.map(r => [r.vendor_slug, r])).values());

  return NextResponse.json({ results: uniqueResults });
}