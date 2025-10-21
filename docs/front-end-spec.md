# YumYum Premium Tier UI/UX Specification

### 1. Introduction

This document defines the user experience goals, information architecture, user flows, and visual design specifications for the new Premium Tier features. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

#### **Overall UX Goals & Principles**

*   **Target User Personas:**
    *   **The Efficiency-Focused Vendor:** The primary user of the new dashboard. They are a business owner who values time and wants to manage their digital storefront with minimal friction.
    *   **The Prospective Vendor:** The primary user of the redesigned landing page. They are evaluating YumYum and need to clearly understand the value of both the free and premium offerings.

*   **Usability Goals:**
    *   **Efficiency:** A vendor must be able to update a dish's price or availability via the dashboard faster than they could by opening and editing a Google Sheet.
    *   **Clarity:** The landing page must make the benefits and features of each tier so clear that a prospective vendor can confidently choose the right path for their business.
    *   **Ease of Use:** A non-technical vendor should be able to log in and successfully manage their dishes, brand, and status without needing a tutorial.

*   **Design Principles:**
    1.  **Efficiency First:** Every click and interaction in the dashboard must be optimized to save the vendor time.
    2.  **Clarity in Choice:** The landing page must guide users to a decision, not confuse them with options.
    3.  **Consistency is Key:** The new dashboard and landing page sections must feel like a natural, integrated part of the existing application.

#### **Change Log**
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-10-20 | 1.0 | Initial draft created from PRD v1.0. | Sally (UX) |

---
### 2. Information Architecture (IA)

#### **Site Map / Screen Inventory**
```mermaid
graph TD
    subgraph Public Site
        A[/ Landing Page] --> C[/login - Magic Link Page];
    end

    subgraph Authenticated App
        C -- Successful Login --> D[/vendor/dashboard];
        D --> E[Dishes Management];
        D --> F[Brand Profile Management];
        D --> G[Status Management];
    end

    subgraph External
        A -- "Interested?" FAB --> H[WhatsApp];
    end
```

#### **Navigation Structure**
*   **Primary Navigation (Vendor Dashboard):** Once a vendor is logged in, the primary navigation within the `/vendor/dashboard` will consist of a simple, clear mechanism (e.g., a sidebar or top tabs) to switch between the three main management areas: "Dishes," "Brand Profile," and "Status."
*   **Secondary Navigation:** This will consist of controls within a specific management area, such as "Add New Dish" or "Search Dishes" within the Dishes view.
*   **Breadcrumb Strategy:** A breadcrumb trail (e.g., `Dashboard > Dishes > Edit 'Spicy Pizza'`) should be used within the dashboard to ensure the vendor always knows where they are, especially on mobile devices.

---
### 3. User Flows

#### **Flow 1: Premium Lead Generation**
*   **User Goal:** To express interest in the premium plan and contact the YumYum team.
*   **Entry Points:** Clicking the "Interested?" FAB on the landing page.
*   **Success Criteria:** The user successfully opens a pre-filled WhatsApp chat.

##### Flow Diagram
```mermaid
graph TD
    A[User Clicks "Interested?" FAB] --> B[Opens new tab to WhatsApp with pre-filled message];
```

##### Edge Cases & Error Handling:
*   N/A for this simplified flow.

---
#### **Flow 2: Vendor Login via Magic Link**
*   **User Goal:** To securely access the vendor dashboard.
*   **Entry Points:** Visiting `/vendor/dashboard` directly when not logged in; clicking a "Login" button.
*   **Success Criteria:** The user is successfully authenticated and redirected to their dashboard.

##### Flow Diagram
```mermaid
graph TD
    A[User navigates to /login] --> B[Enters email];
    B --> C[Clicks "Send Magic Link"];
    C --> D{System calls Supabase Auth};
    D --> E[User sees "Check your email" message];
    subgraph User's Email Client
        F[User opens email] --> G[Clicks unique login link];
    end
    G --> H{User is redirected to the app};
    H --> I[App verifies token];
    I --> J[/vendor/dashboard is displayed];
```

##### Edge Cases & Error Handling:
*   If the user enters an email not associated with a premium account, the system should still send a link, but the page they land on will inform them they do not have access and will guide them to the "Interested?" flow.
*   If the magic link has expired, the user will be shown a message and prompted to request a new one.

---
#### **Flow 3: Update a Dish Price**
*   **User Goal:** To quickly change the price of a menu item.
*   **Entry Points:** The "Dishes" management view within the vendor dashboard.
*   **Success Criteria:** The new price is saved to the database and the UI updates to reflect the change.

##### Flow Diagram
```mermaid
graph TD
    A[User navigates to 'Dishes' view] --> B[Finds dish in list];
    B --> C[Clicks "Edit"];
    C --> D[Dish form opens];
    D --> E[User changes price field];
    E --> F[Clicks "Save"];
    F --> G{UI shows loading state};
    G --> H{App sends UPDATE to Supabase};
    H -- Success --> I[UI shows 'Saved!' toast];
    I --> J[Dish list updates with new price];
    H -- Failure --> K[UI shows 'Error saving' toast];
```

##### Edge Cases & Error Handling:
*   If the save operation fails due to a network error, the form should remain open with the user's changes intact, and an error message should be displayed.
*   Input validation should prevent a user from saving a non-numeric or negative price.

---
### 4. Wireframes & Mockups

**Primary Design Files:**
*   High-fidelity mockups and prototypes will be created and maintained in **Figma**. A link will be added here once the file is created.

---
#### **Key Screen Layout: Vendor Dashboard**

*   **Purpose:**
    To provide a central, simple, and efficient hub for vendors to manage all aspects of their digital storefront without leaving the application.

*   **Key Elements:**
    1.  **Main Navigation:** A simple and clear tab-based navigation bar at the top of the screen with three items: "Dishes," "Brand Profile," and "Status."
    2.  **Content Area:** The main body of the page, which will render the appropriate management interface based on the selected tab.
    3.  **Primary Action Button:** A floating action button (e.g., a "+" icon) at the bottom right of the screen, which will serve as the "Add New Dish" or "Add New Status" button.
    4.  **User/Logout Control:** A user profile icon in the top-right header that opens a small dropdown with a "Logout" option.

*   **Interaction Notes:**
    Tapping a tab instantly switches the view in the Content Area. The interface will use client-side routing, making the transition feel fast and app-like.

---
### 5. Component Library / Design System

*   **Design System Approach:**
    We will continue to use the project's established component strategy: using **Shadcn UI** for base components, styling with **Tailwind CSS**, and composing new, project-specific components.

---
#### **Core Components (New for Dashboard)**

*   **`DashboardNav`**
    *   **Purpose:** To provide the primary tab-based navigation within the vendor dashboard.

*   **`DataTable`**
    *   **Purpose:** A reusable table component to display lists of data like dishes, including action buttons for "Edit" and "Delete."

*   **`EntityForm`**
    *   **Purpose:** A generic form component for creating/editing dishes, brand info, and statuses, including the Cloudinary image uploader.

---
### 6. Branding & Style Guide

*   **Visual Identity:**
    *   We will continue to follow the established brand guidelines. The aesthetic is clean, modern, and "food-centric."

*   **Color Palette:**
    *   The existing project color palette will be used for all new components.

| Color Type | Hex Code | Usage |
| :--- | :--- | :--- |
| Background | `#FEF3E2` | App base, page backgrounds |
| Primary | `#FAB12F` | Main CTAs, active states |
| Text Primary | `#111827` | Default body content |

*   **Typography:**
    *   **Font Families:** We will continue to use **Inter**.

*   **Iconography:**
    *   **Icon Library:** We will continue to use **Lucide Icons** exclusively.

---
### 7. Accessibility Requirements

*   **Compliance Target:**
    *   **Standard:** WCAG 2.1 Level AA. This is a non-negotiable requirement.

*   **Key Requirements:**
    *   All functionality must be keyboard navigable.
    *   All controls must have appropriate ARIA labels.
    *   All images must have descriptive `alt` text.

*   **Testing Strategy:**
    *   A combination of automated checks (`axe-core`) and manual keyboard/screen reader testing.

---
### 8. Responsiveness Strategy

*   **Breakpoints:**
    *   We will continue to use the project's standard breakpoints (Mobile < 768px, Tablet >= 768px, Desktop > 1024px).

*   **Adaptation Patterns for the Vendor Dashboard:**
    *   The dashboard will use a collapsible sidebar or top tab bar for navigation on mobile.
    *   Data tables will reflow into a card-based list view on mobile screens to avoid horizontal scrolling.

---
### 9. Animation & Micro-interactions

*   **Motion Principles:**
    *   Animations must prioritize clarity and speed over elaborate effects.

*   **Key Animations for New Features:**
    *   **Form Feedback:** Buttons will have loading/success/error states.
    *   **List Item Deletion:** Items will fade out smoothly on deletion.
    *   **Drawer Transitions:** The "Interested?" drawer will slide in smoothly.

---
### 10. Performance Considerations

*   **Performance Goals:**
    *   The public landing page must maintain an LCP of under 2.5 seconds.
    *   Dashboard interactions must feel instant (<100ms response).

*   **Design Strategies for Performance:**
    *   Leverage Next.js code splitting for the authenticated dashboard routes.
    *   Continue to use Cloudinary for all image optimization.
    *   Implement a client-side caching strategy for dashboard data to ensure fast subsequent loads.

---
### 11. Next Steps

*   **Immediate Actions:**
    1.  **Stakeholder Review:** This UI/UX Specification document should be shared for final approval.
    2.  **High-Fidelity Design:** Begin creating detailed mockups and interactive prototypes in Figma.
    3.  **Developer Handoff:** This document and the Figma designs will be handed off to the Architect and Development team to begin implementation.

*   **Design Handoff Checklist:**
    *   [x] All user flows documented
    *   [x] Component inventory complete
    *   [x] Accessibility requirements defined
    *   [x] Responsive strategy clear
    *   [x] Brand guidelines incorporated
    *   [x] Performance goals established