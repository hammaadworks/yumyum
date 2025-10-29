# Section 6 of 18: Components

This section outlines the high-level frontend components required for the Premium Tier vendor dashboard.

## `VendorDashboard`

- **Responsibility:** Acts as the main layout and container for the entire authenticated vendor experience. It will handle the routing between the different management sections.
- **Dependencies:** `AuthManager`, `DashboardNav`.

## `DishesManagement`

- **Responsibility:** Provides the full CRUD interface for a vendor to manage their dishes. It will include a data table to list dishes and a form to add/edit them.
- **Dependencies:** `DataTable`, `EntityForm`, Supabase client.

## `BrandProfileManagement`

- **Responsibility:** Provides a form for the vendor to update their brand profile information.
- **Dependencies:** `EntityForm`, Supabase client.

## `StatusManagement`

- **Responsibility:** Provides an interface for the vendor to manage their daily status updates.
- **Dependencies:** `EntityForm`, Supabase client.

## `AuthManager`

- **Responsibility:** Handles the entire authentication flow, including the Magic Link login form, redirect handling, and logout functionality.
- **Dependencies:** Supabase client.

## `DataTable`

- **Responsibility:** A reusable component to display lists of data (e.g., dishes) in a table with sorting, filtering, and action buttons.
- **Dependencies:** Shadcn UI Table component.

## `EntityForm`

- **Responsibility:** A generic, reusable form component for creating and editing entities (Dishes, Brand Profile, Status). It will include input fields, validation, and the ImageKit image uploader.
- **Dependencies:** React Hook Form, Shadcn UI Form components, ImageKit uploader.

## `PublicVendorPage`

- **Responsibility:** Renders the entire public-facing vendor page. This is a Server Component that fetches its own data for ISR.
- **Dependencies:** `BrandHeader`, `CategoryHighlights`, `ControlsBar`, `DishGrid`.

---
