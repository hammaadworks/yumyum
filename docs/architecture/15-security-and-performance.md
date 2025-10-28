# Section 15 of 18: Security and Performance

This section covers the key strategies for ensuring the application is secure and performant.

## Security Requirements

Our security model is based on a defense-in-depth approach, leveraging the capabilities of our chosen platforms.

*   **Authentication:** All vendor authentication is handled by **Supabase Auth**, using passwordless Magic Links. This outsources the complexity of password management and reduces the risk of credential theft.
*   **Authorization:** The cornerstone of our data security is **Postgres Row-Level Security (RLS)**. RLS policies, defined in Section 11, ensure that a vendor can *only* access and modify their own data. These policies are enforced at the database level, providing a robust barrier against unauthorized data access. Specifically, RLS policies must be implemented for the `public.vendor_mappings` table to restrict vendors to viewing and managing only their own mapping data.

*   **API Security:** By using the official Supabase client library, we ensure that JWTs are managed securely and automatically. All API access is governed by the RLS policies.
*   **Secret Management:** All sensitive information, such as API keys and database URLs, are stored as environment variables in Vercel and are not exposed to the client-side application.
*   **Infrastructure Security:** We rely on Vercel and Supabase to manage infrastructure-level security, including DDoS protection, firewalling, and physical security.

## Performance Optimization

*   **Public Pages (SEO):** The public-facing vendor pages (`/[vendor_slug]`) use **Static Site Generation (SSG) with Incremental Static Regeneration (ISR)**. This provides extremely fast static pages from the CDN that are perfect for SEO, while ensuring data is kept fresh automatically in the background.
*   **Authenticated Dashboard (CSR):** The vendor dashboard is a **Client-Side Rendered (CSR)** application. This provides a fast, app-like experience after the initial load, as navigation between sections does not require full page reloads.
*   **Global CDN:** All static assets and server-rendered pages are cached and served from **Vercel's Global Edge Network**, ensuring low latency for users worldwide.
*   **Media Optimization:** All images and media assets are served via **ImageKit**, which provides automatic optimization, format selection (e.g., WebP), and CDN delivery.
*   **Client-Side Caching:** The application will leverage browser caching and client-side state management (Zustand) to minimize redundant data fetching during a user session.

---
