# 6. Epic Details

#### **Epic 1: Marketing & Lead Generation**
*   **Story 1.1: Overhaul Landing Page as a Sales Funnel**
    *   *As a potential vendor, I want to see a compelling landing page that clearly explains the benefits of the entire platform, so that I am convinced to sign up or learn more.*
    *   **Acceptance Criteria:** 1. The landing page (`/`) is redesigned to function as a persuasive sales page. 2. It clearly articulates the value proposition for both free and premium tiers. 3. The page includes clear CTAs for both tiers, including an "Interested?" button. 4. The design is modern, professional, and aligns with the brand.
*   **Story 1.2: Implement 'Chat on WhatsApp' FAB**
    *   *As a vendor interested in the premium plan, I want to instantly start a WhatsApp chat with a pre-filled message, so that I can quickly inquire about the service.*
    *   **Acceptance Criteria:** 1. The "Interested?" FAB (Floating Action Button) is present on the landing page. 2. Clicking the FAB opens a WhatsApp chat (`wa.me` link). 3. The WhatsApp chat is pre-populated with a standard message. 4. The target phone number and the pre-populated message are defined in a constants file.

#### **Epic 2: Backend Foundation & Vendor Authentication**
*   **Story 2.1: Provision and Configure Supabase Projects**
    *   *As a developer, I need the Supabase projects set up and a database-driven vendor mapping system in place, so I can begin backend development.*
    *   **Acceptance Criteria:** 1. A primary Supabase project and a pool of subsidiary vendor accounts are created. 2. API keys are added to environment variables. 3. A `vendor_mappings` table is created in the primary project. 4. The manual vendor allocation process is documented in the wiki.
*   **Story 2.2: Define and Apply Database Schema**
    *   *As the system, I need the database tables for vendor data to be created, so that data can be stored in a structured way.*
    *   **Acceptance Criteria:** 1. SQL scripts are written for `brand`, `dishes`, `status`, and updated for `vendor_mappings` to include `membership_fee`, `membership_validity`, and `is_member`. 2. The schema is consistent with the original GSheets structure. 3. Scripts are applied to both Supabase projects. 4. RLS is enabled on all tables, specifically including `vendor_mappings`.
*   **Story 2.3: Implement Magic Link Authentication**
    *   *As a vendor, I want to securely log in using only my email, so that I don't have to remember a password.*
    *   **Acceptance Criteria:** 1. A `/login` page is created. 2. Submitting an email first checks against the `vendor_mappings` table. 3. If the email is not found in `vendor_mappings`, an error message is displayed, and no magic link is sent. 4. If the email is found, it triggers the Supabase magic link function. 5. The UI informs the user to check their email. 6. Clicking the link authenticates the user and redirects them to `/{vendor-slug}/dashboard`.
*   **Story 2.4: Create Protected Dashboard Route & Logout**
    *   *As a vendor, I want the management dashboard to be private, so that my business data is secure.*
    *   **Acceptance Criteria:** 1. A new route is created at `/vendor/dashboard`. 2. Unauthenticated users are redirected to `/login`. 3. A "Logout" button is available and functional.
*   **Story 2.5: Create Project Wiki and Initial Documents**
    *   *As a new team member, I want a central place for documentation, so that I can get up to speed quickly.*
    *   **Acceptance Criteria:** 1. A `/wiki` directory is created at the project root. 2. An initial document explaining the multi-account architecture is created. 3. A second document detailing the manual vendor onboarding workflows is created.
*   **Story 2.6: Develop Admin APIs for Membership Management**
    *   *As an administrator, I want APIs to easily change a vendor's `is_member` status, so that I can manage their membership validity.*
    *   **Acceptance Criteria:** 1. APIs are developed within the YumYum admin panel to update the `is_member` field in the `vendor_mappings` table. 2. The APIs ensure proper authentication and authorization for admin users. 3. The APIs can set `is_member` to `true` or `false` for a given vendor.

#### **Epic 3: In-App Vendor Dashboard**
*   **Story 3.1: Build Dashboard Layout and Data Connection**
    *   *As a logged-in vendor, I want a clear dashboard layout that correctly loads my data, so that I have a central place to manage my storefront.*
    *   **Acceptance Criteria:** 1. A basic layout is created for `/vendor/dashboard`. 2. The layout includes navigation for "Dishes," "Brand Profile," and "Status." 3. The dashboard fetches and displays data for the logged-in vendor from the correct Supabase project. 4. The "Logout" button is present.
*   **Story 3.2: Implement "Dishes" CRUD Interface**
    *   *As a vendor, I want to add, view, update, and delete my menu dishes from within the app, so that I can manage my menu efficiently.*
    *   **Acceptance Criteria:** 1. The "Dishes" section displays a list of dishes. 2. An "Add New Dish" button opens a creation form. 3. Each dish has "Edit" and "Delete" controls. 4. The forms correctly perform `INSERT`, `UPDATE`, and `DELETE` operations.
*   **Story 3.3: Integrate ImageKit Uploader into Dishes Form**
    *   *As a vendor adding a dish, I want to upload an image directly from the form, so that I don't have to manually manage URLs.*
    *   **Acceptance Criteria:** 1. The "Add/Edit Dish" form includes an image upload component. 2. The uploader uses the vendor's mapped ImageKit account. 3. On success, the ImageKit URL is populated into the form's `image` field.
*   **Story 3.4: Implement "Brand Profile" and "Status" Management**
    *   *As a vendor, I want to update my brand information and daily status from within the app, so that all my business data is managed in one place.*
    *   **Acceptance Criteria:** 1. The "Brand Profile" section provides a form to edit the `brand` table. 2. The "Status" section provides an interface to perform CRUD operations on the `status` table.

---
