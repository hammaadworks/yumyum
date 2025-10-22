# Section 2 of 18: High Level Architecture

## Technical Summary

The YumYum Premium Tier architecture is a modern, serverless, fullstack solution designed for scalability and developer efficiency. The frontend remains a **Next.js** application hosted on **Vercel**, providing a fast, responsive user experience. The backend is powered by **Supabase**, which provides a Postgres database, secure authentication (Magic Links), and auto-generated APIs. This architecture directly supports the PRD goals by enabling secure, multi-tenant vendor dashboards, CRUD operations on vendor data, and a clear path for future feature development, all while adhering to the "Free Tier Maximization" principle.

## Platform and Infrastructure Choice

*   **Platform:** Vercel and Supabase
*   **Key Services:**
    *   **Vercel:** Hosting, CI/CD (Free Tier), SEO.
    *   **Supabase:** PostgreSQL Database, Authentication (Magic Link), Storage, Auto-generated APIs.
    *   **ImageKit:** Multi-account media hosting and optimization.
    *   **Lark:** Webhook for critical alerts.
*   **Deployment Host and Regions:** Vercel (Global Edge Network), Supabase (`ap-south-1` Mumbai).

## Repository Structure

*   **Structure:** Monorepo
*   **Monorepo Tool:** pnpm workspaces
*   **Package Organization:** The existing monorepo structure will be maintained. New backend-related code (e.g., Supabase schema, RLS policies) will be organized within the existing project structure, likely in a new `supabase/` directory at the root.

## High Level Architecture Diagram

```mermaid
graph TD
    subgraph "Public User"
        U_Browser[User's Browser]
    end

    subgraph "Authenticated User (Vendor)"
        A[Vendor's Browser]
    end

    subgraph "Vercel Platform"
        B_SSR[Next.js Server (SSR)]
        B_CSR[Next.js Client App (CSR)]
    end

    subgraph "Supabase Platform"
        D[Supabase Auth (Magic Link)]
        E[Supabase API (PostgREST)]
        F[PostgreSQL Database]
        SP[Primary Supabase (Mappings)]
    end

    subgraph "External Services"
        G[ImageKit (Media)]
        H[Lark (Alerts)]
        GS[Google Sheets]
    end

    %% Public User Flow (SSR)
    U_Browser -- GET /[vendor_slug] --> B_SSR
    B_SSR -- Reads Mapping --> SP
    B_SSR -- Fetches Data --> F
    B_SSR -- or Fetches Data --> GS
    B_SSR -- Renders HTML --> U_Browser

    %% Authenticated Vendor Flow (CSR)
    A -- Login Request --> B_CSR
    B_CSR -- Calls Auth --> D
    D -- Sends Magic Link --> A
    A -- Clicks Link --> B_CSR
    B_CSR -- Verifies & Creates Session --> D
    B_CSR -- Authenticated API Calls --> E
    E -- Enforces RLS --> F
    B_CSR -- Image Uploads/Views --> G
    E -- Critical Failure --> H
```

## Architectural Patterns

*   **Jamstack Architecture:** The frontend remains a pre-rendered application served from a global CDN, with dynamic functionality handled by client-side JavaScript interacting with the Supabase backend.
    *   *Rationale:* This ensures maximum performance and a great user experience.
*   **Backend as a Service (BaaS):** We are leveraging Supabase to provide backend functionality out-of-the-box.
    *   *Rationale:* This dramatically reduces backend development time, allowing us to focus on the vendor-facing dashboard and features.
*   **Row-Level Security (RLS):** All data access will be controlled at the database level using Supabase's RLS policies.
    *   *Rationale:* This is a highly secure and scalable way to enforce data isolation between vendors.
*   **Client-Side Rendering (CSR) for Dashboard:** The vendor dashboard will be a dynamic, client-side rendered application.
    *   *Rationale:* This provides a rich, app-like experience for logged-in vendors.

---
