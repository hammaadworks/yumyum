# Project Brief: Premium Tier MVP

### Section 1 of 10: Executive Summary
This project introduces a premium subscription tier to the YumYum platform by integrating Supabase for robust database and authentication services. This new tier will operate alongside the existing Google Sheets-based free tier, targeting ambitious vendors who require greater scalability, enhanced security, and personalized support. The core value proposition is to offer a seamless upgrade path to a more powerful backend, enabling advanced features and a superior user experience, thereby creating a new, recurring revenue stream for YumYum.

### Section 2 of 10: Problem Statement
The current architecture, while simple, lacks two fundamental components required for a premium service: a robust database and a secure authentication system. The reliance on a public Google Sheet prevents us from offering secure, vendor-specific data management. More importantly, the absence of a dedicated authentication service like Supabase Auth means we cannot provide features like secure vendor logins, personalized customer accounts via Google OAuth, or any functionality that depends on knowing *who* the user is. This technical ceiling is the primary blocker to developing a feature-rich, scalable, and defensible premium product.

### Section 3 of 10: Proposed Solution
We will introduce a "Premium Tier" by integrating Supabase as a parallel backend. The upgrade process will be a high-touch, "white-glove" service: upon receiving a webhook for a migration request, the YumYum team will personally contact the vendor to manage the data transfer and provide dedicated training.

Architecturally, this solution will leverage **two separate Supabase accounts** to optimize resource allocation and manage costs. A primary database will be dedicated to core user authentication (Supabase Auth) and customer data. The heavier, vendor-specific tables (like `brand` and `dishes`) will be strategically distributed across the two Supabase projects. This multi-account approach, similar to the existing Cloudinary setup, ensures scalability while maintaining cost efficiency.

### Section 4 of 10: Target Users
The primary target for the Premium Tier is the **"Efficiency-Focused Vendor."**
*   **Profile:** A business owner who values their time and prefers integrated, all-in-one solutions. They are comfortable using apps to manage their business and see operational friction as a direct cost.
*   **Behaviors:** They find the current workflow of switching between the YumYum app and Google Sheets to be inefficient and a barrier to making frequent updates. The hassle of opening a spreadsheet means their digital menu might not always be perfectly up-to-date.
*   **Needs:** They need a single, secure, in-app dashboard to manage their entire digital storefront. Their primary requirement is the ability to instantly update menu items, prices, and availability via a simple CRUD interface, without ever leaving the application. A secure login is essential to protect their business data.

### Section 5 of 10: Goals & Success Metrics
#### Business Objectives
*   Successfully launch a new recurring revenue stream by converting existing vendors to a paid premium tier.
    *   **Metric:** Onboard at least 5 paying vendors to the Premium Tier within the first two months post-launch.
*   Validate that the in-app dashboard is a high-value feature that improves vendor workflow.
    *   **Metric:** Achieve a vendor satisfaction score of >8/10 specifically for the new management dashboard.
#### User Success Metrics (For the Vendor)
*   **Increased Menu Dynamism:** Vendors can manage their menu more actively.
    *   **Metric:** We will measure an increase in the frequency of menu updates (e.g., price changes, `instock` status updates) per vendor after migrating by analyzing backend data.
*   **High Adoption & Stickiness:** The dashboard becomes an integral part of the vendor's daily operations.
    *   **Metric:** High engagement rates (Daily/Weekly Active Users) with the vendor management dashboard, tracked in Google Analytics.
#### Key Performance Indicators (KPIs)
*   **Business KPIs:** `Premium MRR`, `Premium Churn Rate`.
*   **Google Analytics Tracking Plan:**
    *   **Premium Conversion Funnel:**
            *   `event: premium_upgrade_initiated`: Fired when the user clicks the "Interested?" FAB.
            *   **Vendor Dashboard Engagement:**
                *   `event: dashboard_viewed`: Fired when the vendor loads their management dashboard.
                *   `event: dashboard_item_created`: Fired each time a vendor creates a new dish.
                *   `event: dashboard_item_updated`: Fired each time a vendor saves changes to a dish or their brand profile.
                *   `event: dashboard_item_deleted`: Fired each time a vendor deletes a dish.
        
        ### Section 6 of 10: MVP Scope
        #### Core Features (Must Have)
        *   **Landing Page Update:** A new section will be added to the main landing page (`/`) to advertise the Premium Tier.
        *   **Supabase Backend & Auth:** Setup of two Supabase projects and implementation of Supabase Auth for secure vendor login.
        *   **Comprehensive In-App Vendor Dashboard (CRUD):** A protected page for vendors to perform CRUD operations on all their data (`brand`, `dishes`, `status`).
        *   **Premium Interest Workflow:** A UI element (FAB) that provides a direct contact method via WhatsApp for users interested in upgrading.*   **Manual Migration Process:** A well-defined internal process for the team to manually migrate vendor data.
#### Out of Scope for MVP
*   **End-Customer Accounts:** Auth is for **vendors only** in the MVP.
*   **Automated Migration:** Migration is a manual, internal process.
*   **Advanced Dashboard Features:** The dashboard is for CRUD only, no analytics.

### Section 7 of 10: Post-MVP Vision
#### Phase 2 Features (Next Priorities)
*   **End-Customer Accounts:** Introduce customer logins using Supabase Auth.
*   **Vendor Analytics Dashboard:** Provide vendors with simple, actionable insights.
*   **Self-Serve Migration Tool:** Develop an automated tool for data migration.
#### Long-term Vision (1-2 Years)
*   **Lightweight POS System:** Evolve the platform to include more Point-of-Sale functionalities.
*   **Marketing & Loyalty Suite:** Build tools for promotions and loyalty programs.
*   **Third-Party Integrations:** Explore integrations with delivery services and accounting software.

### Section 8 of 10: Technical Considerations
#### Core Architectural Principle: Free Tier Maximization
*   The entire system **must** be engineered to operate within the free tiers of all underlying platforms. Profitability will be generated by charging for software features and services, not by passing on infrastructure costs.
#### Architecture Considerations
*   **Multi-Account Architecture:** The system will distribute vendors across multiple Supabase and Cloudinary accounts to stay under free tier usage limits.
*   **Vendor Allocation Strategy:** For the MVP, new premium vendors will be allocated to a Supabase account **manually** by the team.
*   **Data Isolation:** Row Level Security (RLS) must be strictly enforced within Supabase.
*   **Jamstack Adherence:** The new vendor dashboard will be built as a client-side rendered (CSR) application.

### Section 9 of 10: Constraints & Assumptions
#### Constraints
*   **Payment Processing:** For the MVP, all subscription payments will be collected **manually**. No in-app payment integration is required.
*   **Budget / Infrastructure Cost:** Strictly zero. The solution must operate within free usage tiers.
*   **Technical Architecture:** The application must remain a static Jamstack project.
*   **Team Resources:** Manual processes (migration, payment) will be performed by the core team.
#### Key Assumptions
*   **Value Proposition:** We assume the in-app dashboard is valuable enough to justify a subscription fee.
*   **Free Tier Viability:** We assume the multi-account strategy is a sustainable way to scale while avoiding costs.
*   **Migration Process:** We assume vendors will be receptive to a manual migration process.

### Section 10 of 10: Risks & Open Questions
#### Key Risks
*   **Free Tier Scalability Risk:** A few successful vendors could exceed free tier limits, breaking the business model.
*   **Manual Process Bottleneck:** Manual migration and payment could become unmanageable if the tier grows quickly.
*   **Value Proposition Risk:** Vendors may not perceive enough value in the dashboard to pay a recurring fee.
#### Open Questions
*   What is the specific monthly price for the Premium Tier?
*   What is the detailed process for the manual migration and payment collection?