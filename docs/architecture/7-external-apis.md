# Section 7 of 18: External APIs

This section details the external services the YumYum Premium Tier will integrate with, including strict data handling rules.

## Data Source Rules

These rules are mandatory and must be strictly followed without exception.

1.  **Supabase is Primary:** Supabase is the definitive source of truth for all vendor data. If a vendor exists in Supabase, it is the only data source that should be used for that vendor.
2.  **Google Sheets is a Read-Only Fallback:** Google Sheets serves as a secondary data source. It must **only** be queried if a vendor's credentials are not present in the Supabase vendor mapping. Under no circumstances should write operations be performed on Google Sheets.
3.  **Schema Parity:** The schema for a vendor in Google Sheets **must** be an exact match to the schema in Supabase. No discrepancies are tolerated. If a schema mismatch is detected, the operation should fail and an error must be logged immediately.
4.  **Discard on Overlap:** If a vendor has data in both Supabase and Google Sheets, the Google Sheets data is to be considered stale and must be ignored completely. All operations **must** be directed to Supabase.

---

## Supabase API

- **Purpose:** Serves as the primary backend for data storage, authentication, and serverless functions. It is the single source of truth for all core application data.
- **Documentation:** [https://supabase.com/docs](https://supabase.com/docs)
- **Authentication:** API Key and JWT for client-side access.

## Google Sheets API

- **Purpose:** Serves as a secondary, **read-only** data source for vendor information when Supabase data is unavailable.
- **Authentication:** None. The source sheet is publicly accessible to anyone with the link.
- **Usage:** Access is for read operations only.

## ImageKit API

- **Purpose:** Hosts, optimizes, and serves all media assets (vendor logos, dish images).
- **Documentation:** [https://docs.imagekit.io/](https://docs.imagekit.io/)
- **Authentication:** API Key and Secret for upload operations.

## Lark Webhook API

- **Purpose:** Used for sending critical system alerts to the development team's communication channel.
- **Documentation:** Specific to the configured incoming webhook URL.
- **Authentication:** None (relies on the secrecy of the webhook URL).

---
