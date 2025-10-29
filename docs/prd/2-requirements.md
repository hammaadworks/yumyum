# 2. Requirements

#### **Functional Requirements**

1.  **FR1:** The main landing page (`/`) shall be updated to include a marketing section advertising the Premium Tier.
2.  **FR2:** The system shall provide a secure login page for vendors using a Magic Link (passwordless) system via Supabase Auth. The login process must first verify the user's email against the `vendor_mappings` table. If the email is not found, the system shall display an appropriate error message and a home button, without sending a magic link. Upon successful login, the user shall be redirected to `/{vendor-slug}/dashboard`.
3.  **FR3:** A logged-in vendor shall have access to a protected, in-app management dashboard at `/vendor/dashboard`.
4.  **FR4:** The dashboard shall provide CRUD functionality for all of that vendor's data, including their `brand` profile, `dishes`, and daily `status`.
5.  **FR5:** The application shall provide a UI element that allows a free-tier user to request an upgrade, which triggers a Lark webhook notification.
6.  **FR6:** The public-facing menu for a premium vendor shall fetch its data from the Supabase backend.
7.  **FR7:** The system shall track user interaction with the premium features via the specified Google Analytics events.
8.  **FR8:** The `vendor_mapping` table shall be extended to include `membership_fee` (number), `membership_validity` (date), and `is_member` (boolean) fields to track vendor membership and payment status.
9.  **FR9:** The YumYum admin panel shall provide APIs to easily manage and update the `is_member` status for vendors.

#### **Non-Functional Requirements**

1.  **NFR1:** The entire system architecture must operate within the free tiers of all underlying platforms.
2.  **NFR2:** The backend architecture must support a multi-account strategy for Supabase and ImageKit.
3.  **NFR3:** For the MVP, vendor allocation to a Supabase account shall be a manual process.
4.  **NFR4:** The Supabase backend must enforce Row Level Security (RLS) across all sensitive tables, including explicitly the `vendor_mappings` table.
5.  **NFR5:** The vendor management dashboard shall be a Client-Side Rendered (CSR) application.
6.  **NFR6:** For the MVP, all subscription payments shall be collected manually.
7.  **NFR7:** For the MVP, all data migration shall be a manual process.
8.  **NFR8:** The authentication system must ensure a single user identity, linking new login methods to an existing user if they share the same verified email.
9.  **NFR9:** Comprehensive documentation must be maintained. A `/wiki` directory will be created at the project root to house all technical documentation, workflow guides, and user training materials.

---
