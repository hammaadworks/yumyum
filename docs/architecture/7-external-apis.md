# Section 7 of 18: External APIs

This section details the external services the YumYum Premium Tier will integrate with.

## Supabase API

- **Purpose:** Serves as the primary backend for data storage, authentication, and serverless functions.
- **Documentation:** [https://supabase.com/docs](https://supabase.com/docs)
- **Authentication:** API Key and JWT for client-side access.

## ImageKit API

- **Purpose:** Hosts, optimizes, and serves all media assets (vendor logos, dish images).
- **Documentation:** [https://docs.imagekit.io/](https://docs.imagekit.io/)
- **Authentication:** API Key and Secret for upload operations.

## Lark Webhook API

- **Purpose:** Used for sending critical system alerts to the development team's communication channel.
- **Documentation:** Specific to the configured incoming webhook URL.
- **Authentication:** None (relies on the secrecy of the webhook URL).

---
