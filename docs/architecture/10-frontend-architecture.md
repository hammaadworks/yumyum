# Section 10 of 18: Frontend Architecture

This section details the frontend-specific architecture for the Premium Tier dashboard.

## Component Architecture

*   **Component Organization:**
    ```plaintext
    /src/
    ├── app/
    │   ├── (auth)/
    │   │   └── login/
    │   │       └── page.tsx
    │   └── (dashboard)/
    │       ├── vendor/
    │       │   └── dashboard/
    │       │       ├── layout.tsx
    │       │       └── page.tsx
    │       └── layout.tsx
    ├── components/
    │   ├── features/
    │   │   ├── dashboard/
    │   │   └── auth/
    │   ├── shared/
    │   └── ui/
    └── ...
    ```
*   **Component Template:** We will continue to use the `shadcn/ui` component structure, using `React.forwardRef` and `cn` for class name merging.

## State Management

*   **Global State:** Zustand will be used for managing global UI state and the authenticated user session.
    *   `use-ui-store.ts`: For managing UI state like modals, notifications, etc.
    *   `use-auth-store.ts`: For storing the user session and authentication status.
*   **Form State:** React Hook Form will be used for managing all form state within the dashboard.
*   **Server State:** We will use Supabase's client library for managing server state, including caching and revalidation of data fetched from the database.

## Routing

*   **`/login`**: Public route for the Magic Link login form.
*   **`/vendor/dashboard`**: A protected route that will redirect to `/login` if the user is not authenticated. This will be the main entry point for the vendor dashboard.
*   **Protected Route Pattern:** We will implement a higher-order component (HOC) or a layout component that checks for an active user session. If no session exists, it will redirect the user to the `/login` page.

## Frontend Services Layer

*   **API Client:** We will use the official `@supabase/supabase-js` client library to interact with the Supabase backend.
*   **Service Example (`src/services/dishes.ts`):**
    ```typescript
    import { supabase } from '@/lib/supabase';
    import { Dish } from '@/lib/types';

    export async function getDishes(): Promise<Dish[]> {
      const { data, error } = await supabase.from('dishes').select('*');
      if (error) throw error;
      return data;
    }

    export async function updateDish(id: number, updates: Partial<Dish>): Promise<Dish> {
      const { data, error } = await supabase
        .from('dishes')
        .update(updates)
        .eq('id', id)
        .select(); // Return the updated row

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Dish not found or could not be updated.');
      
      return data[0];
    }
    ```

---
