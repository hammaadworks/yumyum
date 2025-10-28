# Vendor Allocation Process

This document outlines the manual process for allocating a new vendor to one of the subsidiary Supabase projects and updating the `vendor_mappings` table.

## Process

1.  **Select a subsidiary Supabase project:** From the pool of available subsidiary projects, choose one that has not yet been allocated to a vendor.
2.  **Record the project ID:** Note the Supabase project ID for the selected project.
3.  **Update the `vendor_mappings` table:** In the primary Supabase project, add a new row to the `vendor_mappings` table with the following information:
    *   `vendor_slug`: The vendor's unique slug.
    *   `backend_type`: Set to `'supabase'`.
    *   `supabase_project_id`: The project ID from the previous step.
    *   `gsheet_id`: Leave as `NULL`.
    *   `imagekit_account_id`: The vendor's ImageKit account ID.
