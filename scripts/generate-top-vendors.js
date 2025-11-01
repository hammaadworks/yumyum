const { BigQuery } = require('@google-cloud/bigquery');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// BigQuery configuration
const GA4_BIGQUERY_PROJECT_ID = process.env.GA4_BIGQUERY_PROJECT_ID;
const GA4_BIGQUERY_DATASET = process.env.GA4_BIGQUERY_DATASET; // e.g., analytics_XXXXXXXXX
const GA4_BIGQUERY_TABLE_PREFIX = process.env.GA4_BIGQUERY_TABLE_PREFIX; // e.g., events_

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_ACCT_1_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize BigQuery client
const bigquery = new BigQuery({
  projectId: GA4_BIGQUERY_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH, // Path to service account key file
});

// Initialize Supabase client with service role key
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
  },
});

async function generateTopVendors() {
  if (
    !GA4_BIGQUERY_PROJECT_ID ||
    !GA4_BIGQUERY_DATASET ||
    !GA4_BIGQUERY_TABLE_PREFIX
  ) {
    console.error('Missing BigQuery environment variables.');
    process.exit(1);
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase environment variables.');
    process.exit(1);
  }
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH) {
    console.error(
      'Missing GOOGLE_APPLICATION_CREDENTIALS_PATH environment variable.',
    );
    process.exit(1);
  }

  const today = new Date();
  const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()));
  const sevenDaysAgo = new Date(lastSunday);
  sevenDaysAgo.setDate(lastSunday.getDate() - 7);

  const startDate = sevenDaysAgo.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const endDate = lastSunday.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

  const tableName = `${GA4_BIGQUERY_PROJECT_ID}.${GA4_BIGQUERY_DATASET}.${GA4_BIGQUERY_TABLE_PREFIX}*`;

  const query = `\n    SELECT\n      REGEXP_EXTRACT(event_params.value.string_value, '/([a-zA-Z0-9-]+)/dashboard') as vendor_slug,\n      COUNT(1) as page_views\n    FROM\n      \`${tableName}\`,\n      UNNEST(event_params) as event_params\n    WHERE\n      _TABLE_SUFFIX BETWEEN '${startDate}' AND '${endDate}'\n      AND event_name = 'page_view'\n      AND event_params.key = 'page_location'\n      AND event_params.value.string_value LIKE '%/dashboard'\n    GROUP BY\n      vendor_slug\n    ORDER BY\n      page_views DESC\n    LIMIT 10;\n  `;

  console.log('Executing BigQuery query...');
  const [job] = await bigquery.createQueryJob({ query });
  const [rows] = await job.getQueryResults();
  console.log('BigQuery query complete.');

  const topVendorsData = [];
  for (const row of rows) {
    if (row.vendor_slug) {
      // Fetch additional vendor details from Supabase
      const { data: vendorMapping, error: mappingError } = await supabaseAdmin
        .from('vendor_mappings')
        .select('user_id')
        .eq('vendor_slug', row.vendor_slug)
        .single();

      if (mappingError || !vendorMapping) {
        console.warn(
          `Vendor mapping not found for slug: ${row.vendor_slug}`,
          mappingError,
        );
        continue;
      }

      const { data: brandData, error: brandError } = await supabaseAdmin
        .from('brand')
        .select('name, cuisine, logo_url')
        .eq('vendor_id', vendorMapping.user_id)
        .single();

      if (brandError || !brandData) {
        console.warn(
          `Brand data not found for user_id: ${vendorMapping.user_id}`,
          brandError,
        );
        continue;
      }

      topVendorsData.push({
        name: brandData.name,
        cuisine: brandData.cuisine,
        vendor_slug: row.vendor_slug,
        logo_url: brandData.logo_url,
      });
    }
  }

  const outputPath = path.resolve(__dirname, '../public/top-vendors.json');
  fs.writeFileSync(outputPath, JSON.stringify(topVendorsData, null, 2));
  console.log(
    `Generated ${topVendorsData.length} top vendors to ${outputPath}`,
  );
}

generateTopVendors().catch(console.error);
