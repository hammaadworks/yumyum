# Section 11 of 18: Backend Architecture

Our backend is provided by **Supabase** as a "Backend as a Service" (BaaS). We will not be writing a traditional backend application. Instead, we will configure and use the services provided by Supabase.

## Service Architecture

*   **Serverless Functions:** If any custom server-side logic is required (e.g., for integrating with a third-party service that requires a secret key), we will use **Supabase Edge Functions**. These are Deno-based TypeScript functions.
    *   **Function Organization:**
        ```plaintext
        /supabase/
        └── functions/
            ├── some-function/
            │   └── index.ts
            └── ...
        ```

## Database Architecture

*   **Schema:** The database schema is defined in Section 9. We will use the Supabase UI and SQL scripts to manage the schema.
*   **Data Access:** All data access from the frontend will be through the auto-generated PostgREST API. We will not be writing custom data access layers in the backend.

## Authentication and Authorization

*   **Authentication:** We will use Supabase's built-in Magic Link (passwordless) authentication.
*   **Authorization:** Authorization will be enforced using Postgres **Row Level Security (RLS)** policies. This is the cornerstone of our security model.
    *   **RLS Policy Example (for `dishes` table):**
        ```sql
        -- 1. Enable RLS on the table
        ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

        -- 2. Allow vendors to see only their own dishes
        CREATE POLICY "Vendors can view their own dishes"
        ON public.dishes FOR SELECT
        USING (auth.uid() = vendor_id);

        -- 3. Allow vendors to insert dishes for themselves
        CREATE POLICY "Vendors can insert their own dishes"
        ON public.dishes FOR INSERT
        WITH CHECK (auth.uid() = vendor_id);

        -- 4. Allow vendors to update their own dishes
        CREATE POLICY "Vendors can update their own dishes"
        ON public.dishes FOR UPDATE
        USING (auth.uid() = vendor_id);

        -- 5. Allow vendors to delete their own dishes
        CREATE POLICY "Vendors can delete their own dishes"
        ON public.dishes FOR DELETE
        USING (auth.uid() = vendor_id);
        ```

---
