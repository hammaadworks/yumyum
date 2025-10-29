# Section 14 of 18: Deployment Architecture

This section outlines the deployment strategy for the YumYum Premium Tier application.

## Deployment Strategy

- **Platform:** The frontend application is hosted and deployed on **Vercel**. The backend services (database, auth, functions) are managed by **Supabase**.
- **Deployment Method:** We use a **Continuous Deployment** model integrated with our Git repository.
  - **Production:** Every push or merge to the `main` branch automatically triggers a build and deployment to the production environment.
  - **Previews:** A unique preview deployment is automatically generated for every pull request, allowing for review and testing before merging.

## CI/CD Pipeline

- **Provider:** The CI/CD pipeline is managed entirely by **Vercel**.
- **Build Command:** `pnpm build`
- **Output Directory:** `.next`
- **Framework Preset:** Next.js

## Database Migrations

- **Tooling:** Supabase database schema changes will be managed using the **Supabase CLI**.
- **Workflow:**
  1.  Developers will generate new migration files locally using the CLI.
  2.  These migration files will be committed to the repository in the `/supabase/migrations` directory.
  3.  When deploying changes to the Supabase backend (e.g., staging or production), these migrations will be applied manually using the Supabase CLI to ensure controlled updates.

---
