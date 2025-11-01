# Top Vendors Feature Setup Guide

This document outlines the manual steps required to fully enable and configure the "Most Visited Vendors" feature on the YumYum homepage.

## 1. Set Up BigQuery Export for GA4

This is a one-time manual setup in your Google Analytics 4 (GA4) property. This step ensures that your raw GA4 event data is automatically exported to Google BigQuery, which is necessary for our automation script to query page view data.

- **Detailed Instructions:** Please refer to the `wiki/bigquery-ga4-export-setup.md` document for step-by-step guidance on how to link your GA4 property to BigQuery.

## 2. Configure GitHub Secrets

These secrets are required for the GitHub Actions workflow (`.github/workflows/update-top-vendors.yml`) to authenticate with Google BigQuery and Supabase, allowing it to fetch data and update the `public/top-vendors.json` file.

**Action:** Add the following secrets to your GitHub repository settings (`Settings > Secrets and variables > Actions > New repository secret`):

- `GA4_BIGQUERY_PROJECT_ID`: Your Google Cloud Project ID where BigQuery is enabled.
- `GA4_BIGQUERY_DATASET`: Your GA4 BigQuery dataset name (e.g., `analytics_XXXXXXXXX`).
- `GA4_BIGQUERY_TABLE_PREFIX`: The prefix for your GA4 event tables (e.g., `events_`).
- `SUPABASE_URL`: Your Supabase project URL (same as `NEXT_PUBLIC_SUPABASE_ACCT_1_URL`).
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (found in Supabase project settings > API). **Handle this key with extreme care as it grants full database access.**
- `GOOGLE_APPLICATION_CREDENTIALS`: The entire JSON content of your Google Cloud service account key file (created for BigQuery access). This should be a multi-line secret.

## 3. Local Environment Variables (for Development/Testing)

If you need to run or test the `scripts/generate-top-vendors.js` script locally, you must set up the corresponding environment variables in your local `.env.local` file. This file should follow the structure outlined in `.env.local.example`.

**Action:** Ensure your `.env.local` file contains entries for:

- `GA4_BIGQUERY_PROJECT_ID`
- `GA4_BIGQUERY_DATASET`
- `GA4_BIGQUERY_TABLE_PREFIX`
- `NEXT_PUBLIC_SUPABASE_ACCT_1_URL` (or `SUPABASE_URL` if you prefer to use that name locally)
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_APPLICATION_CREDENTIALS_PATH`: The local file path to your Google Cloud service account key JSON file (e.g., `./google-credentials.json`).

## 4. Initial Data Generation

After setting up BigQuery Export and configuring your GitHub Secrets, you can manually trigger the GitHub Actions workflow once to generate the initial `public/top-vendors.json` file.

**Action:** Go to your GitHub repository -> Actions -> "Update Top Vendors List" workflow -> Run workflow -> Run workflow.

This will create the `public/top-vendors.json` file, which the `TopVendorsSection` component on your homepage will then consume.
