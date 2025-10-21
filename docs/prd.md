# YumYum Premium Tier Product Requirements Document (PRD)

### 1. Goals and Background Context

#### **Goals**
*   To launch a new recurring revenue stream by onboarding at least 5 paying vendors to the "Premium Tier" within two months.
*   To validate that an in-app management dashboard is a high-value feature that improves vendor workflow, targeting a vendor satisfaction score above 8/10.
*   To increase vendor engagement and menu dynamism by providing a frictionless, in-app editing experience.

#### **Background Context**
The current Google Sheets-based architecture, while effective for initial onboarding, presents a growth ceiling. It lacks the security and feature set (like secure logins and in-app management) required by maturing vendors. This PRD outlines the requirements for a "Premium Tier" MVP that addresses this by introducing a Supabase backend. This will power a secure, in-app dashboard where vendors can manage their entire storefront, solving their need for efficiency and unlocking a new revenue stream for YumYum.

#### **Change Log**
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-10-20 | 1.0 | Initial draft generated from Project Brief. | John (PM) |

---
### 2. Requirements

#### **Functional Requirements**
1.  **FR1:** The main landing page (`/`) shall be updated to include a marketing section advertising the Premium Tier.
2.  **FR2:** The system shall provide a secure login page for vendors using a Magic Link (passwordless) system via Supabase Auth.
3.  **FR3:** A logged-in vendor shall have access to a protected, in-app management dashboard at `/vendor/dashboard`.
4.  **FR4:** The dashboard shall provide CRUD functionality for all of that vendor's data, including their `brand` profile, `dishes`, and daily `status`.
5.  **FR5:** The application shall provide a UI element that allows a free-tier user to request an upgrade, which triggers a Lark webhook notification.
6.  **FR6:** The public-facing menu for a premium vendor shall fetch its data from the Supabase backend.
7.  **FR7:** The system shall track user interaction with the premium features via the specified Google Analytics events.

#### **Non-Functional Requirements**
1.  **NFR1:** The entire system architecture must operate within the free tiers of all underlying platforms.
2.  **NFR2:** The backend architecture must support a multi-account strategy for Supabase and Cloudinary.
3.  **NFR3:** For the MVP, vendor allocation to a Supabase account shall be a manual process.
4.  **NFR4:** The Supabase backend must enforce Row Level Security (RLS).
5.  **NFR5:** The vendor management dashboard shall be a Client-Side Rendered (CSR) application.
6.  **NFR6:** For the MVP, all subscription payments shall be collected manually.
7.  **NFR7:** For the MVP, all data migration shall be a manual process.
8.  **NFR8:** The authentication system must ensure a single user identity, linking new login methods to an existing user if they share the same verified email.
9.  **NFR9:** Comprehensive documentation must be maintained. A `/wiki` directory will be created at the project root to house all technical documentation, workflow guides, and user training materials.

---
### 3. User Interface Design Goals

*   **Overall UX Vision:** To provide a simple, clean, and highly efficient in-app dashboard that makes menu and brand management feel effortless.
*   **Key Interaction Paradigms:** The dashboard will use standard UI patterns: simple forms, tables/lists for viewing, and clear buttons for actions.
*   **Core Screens and Views:**
    1.  Login Page (for Magic Link)
    2.  Vendor Dashboard (`/vendor/dashboard`)
    3.  Landing Page (Updated Premium Section & "Request an Invite" Section)
    4.  "Interested?" Drawer (with WhatsApp and Form options)
*   **Accessibility:** WCAG 2.1 Level AA
*   **Branding:** Adhere to existing brand guidelines.
*   **Target Device and Platforms:** Web Responsive (Mobile & Desktop).

---
### 4. Technical Assumptions

*   **Repository Structure:** Monorepo
*   **Service Architecture:** Serverless (Jamstack)
*   **Testing Requirements:** Unit + Integration
*   **Additional Technical Assumptions:**
    *   **Frontend:** Next.js, React, TypeScript, Tailwind CSS.
    *   **Backend:** Supabase (Postgres + Auth).
    *   **Authentication:** Magic Links for MVP.
    *   **Hosting:** Vercel and Supabase.

---
### 5. Epic List

*   **Epic 1: Marketing & Lead Generation**
    *   **Goal:** To launch a persuasive, sales-focused landing page that effectively communicates the value of both the free and premium tiers, and captures high-quality leads through a flexible contact workflow.
*   **Epic 2: Backend Foundation & Vendor Authentication**
    *   **Goal:** To establish the multi-account Supabase backend, configure the database schema, implement a secure login/logout flow, and create foundational documentation.
*   **Epic 3: In-App Vendor Dashboard**
    *   **Goal:** To build the protected, client-side dashboard where authenticated vendors can perform full CRUD operations on their business data, replacing the need for Google Sheets.

---
### 6. Epic Details

#### **Epic 1: Marketing & Lead Generation**
*   **Story 1.1: Overhaul Landing Page as a Sales Funnel**
    *   *As a potential vendor, I want to see a compelling landing page that clearly explains the benefits of the entire platform, so that I am convinced to sign up or learn more.*
    *   **Acceptance Criteria:** 1. The landing page (`/`) is redesigned to function as a persuasive sales page. 2. It clearly articulates the value proposition for both free and premium tiers. 3. The page includes clear CTAs for both tiers, including an "Interested?" button. 4. The design is modern, professional, and aligns with the brand.
*   **Story 1.2: Implement 'Interested?' Drawer with Dual Contact Options**
    *   *As a vendor interested in the premium plan, I want multiple, easy ways to contact the team, so that I can choose the most convenient method.*
    *   **Acceptance Criteria:** 1. The "Interested?" CTA opens a drawer. 2. The drawer presents "Chat on WhatsApp" and "Request a Call Back" options. 3. The WhatsApp button opens a `wa.me` link. 4. The call back option is a form that collects contact info. 5. Submitting the form sends the data to a Lark webhook and shows a success message.

#### **Epic 2: Backend Foundation & Vendor Authentication**
*   **Story 2.1: Provision and Configure Supabase Projects**
    *   *As a developer, I need the Supabase projects set up and a database-driven vendor mapping system in place, so I can begin backend development.*
    *   **Acceptance Criteria:** 1. A primary Supabase project and a pool of subsidiary vendor accounts are created. 2. API keys are added to environment variables. 3. A `vendor_mappings` table is created in the primary project. 4. The manual vendor allocation process is documented in the wiki.
*   **Story 2.2: Define and Apply Database Schema**
    *   *As the system, I need the database tables for vendor data to be created, so that data can be stored in a structured way.*
    *   **Acceptance Criteria:** 1. SQL scripts are written for `brand`, `dishes`, and `status` tables. 2. The schema is consistent with the original GSheets structure. 3. Scripts are applied to both Supabase projects. 4. RLS is enabled on all tables.
*   **Story 2.3: Implement Magic Link Authentication**
    *   *As a vendor, I want to securely log in using only my email, so that I don't have to remember a password.*
    *   **Acceptance Criteria:** 1. A `/login` page is created. 2. Submitting an email triggers the Supabase magic link function. 3. The UI informs the user to check their email. 4. Clicking the link authenticates the user.
*   **Story 2.4: Create Protected Dashboard Route & Logout**
    *   *As a vendor, I want the management dashboard to be private, so that my business data is secure.*
    *   **Acceptance Criteria:** 1. A new route is created at `/vendor/dashboard`. 2. Unauthenticated users are redirected to `/login`. 3. A "Logout" button is available and functional.
*   **Story 2.5: Create Project Wiki and Initial Documents**
    *   *As a new team member, I want a central place for documentation, so that I can get up to speed quickly.*
    *   **Acceptance Criteria:** 1. A `/wiki` directory is created at the project root. 2. An initial document explaining the multi-account architecture is created. 3. A second document detailing the manual vendor onboarding workflows is created.

#### **Epic 3: In-App Vendor Dashboard**
*   **Story 3.1: Build Dashboard Layout and Data Connection**
    *   *As a logged-in vendor, I want a clear dashboard layout that correctly loads my data, so that I have a central place to manage my storefront.*
    *   **Acceptance Criteria:** 1. A basic layout is created for `/vendor/dashboard`. 2. The layout includes navigation for "Dishes," "Brand Profile," and "Status." 3. The dashboard fetches and displays data for the logged-in vendor from the correct Supabase project. 4. The "Logout" button is present.
*   **Story 3.2: Implement "Dishes" CRUD Interface**
    *   *As a vendor, I want to add, view, update, and delete my menu dishes from within the app, so that I can manage my menu efficiently.*
    *   **Acceptance Criteria:** 1. The "Dishes" section displays a list of dishes. 2. An "Add New Dish" button opens a creation form. 3. Each dish has "Edit" and "Delete" controls. 4. The forms correctly perform `INSERT`, `UPDATE`, and `DELETE` operations.
*   **Story 3.3: Integrate Cloudinary Uploader into Dishes Form**
    *   *As a vendor adding a dish, I want to upload an image directly from the form, so that I don't have to manually manage URLs.*
    *   **Acceptance Criteria:** 1. The "Add/Edit Dish" form includes an image upload component. 2. The uploader uses the vendor's mapped Cloudinary account. 3. On success, the Cloudinary URL is populated into the form's `image` field.
*   **Story 3.4: Implement "Brand Profile" and "Status" Management**
    *   *As a vendor, I want to update my brand information and daily status from within the app, so that all my business data is managed in one place.*
    *   **Acceptance Criteria:** 1. The "Brand Profile" section provides a form to edit the `brand` table. 2. The "Status" section provides an interface to perform CRUD operations on the `status` table.

---
### 7. Checklist Results Report

*   **Overall PRD Completeness:** 95%
*   **MVP Scope Appropriateness:** Just Right
*   **Readiness for Architecture Phase:** Ready
*   **Critical Issues:** None. The main risk to monitor is the "Free Tier Maximization" strategy.

### 8. Next Steps

#### **UX Expert Prompt**
> "Please review the finalized PRD in `docs/prd.md`. Your task is to create a detailed UI/UX specification and high-fidelity mockups for the new features, focusing on the Vendor Dashboard (`/vendor/dashboard`) and the updated sales-focused landing page. Ensure the design for the dashboard is intuitive and efficient for a non-technical user."

#### **Architect Prompt**
> "Please review the finalized PRD in `docs/prd.md`. Your task is to create the technical architecture document for the Premium Tier. Pay close attention to the 'Free Tier Maximization' principle and the multi-account strategy for Supabase and Cloudinary. Please define the implementation details for the Magic Link authentication flow, the database schema, and the APIs required for the vendor dashboard."