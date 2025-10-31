# YumYum Premium Tier UI/UX Specification

### 1. Introduction

This document defines the user experience goals, information architecture, user flows, and visual design specifications for the new Premium Tier features. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

#### **Overall UX Goals & Principles**

- **Target User Personas:**
  - **The Efficiency-Focused Vendor:** The primary user of the new dashboard. They are a business owner who values time and wants to manage their digital storefront with minimal friction.
  - **The Prospective Vendor:** The primary user of the redesigned landing page. They are evaluating YumYum and need to clearly understand the value of both the free and premium offerings.

- **Usability Goals:**
  - **Efficiency:** A vendor must be able to update a dish's price or availability via the dashboard faster than they could by opening and editing a Google Sheet.
  - **Clarity:** The landing page must make the benefits and features of each tier so clear that a prospective vendor can confidently choose the right path for their business.
  - **Ease of Use:** A non-technical vendor should be able to log in and successfully manage their dishes, brand, and status without needing a tutorial.

- **Design Principles:**
  1.  **Efficiency First:** Every click and interaction in the dashboard must be optimized to save the vendor time.
  2.  **Clarity in Choice:** The landing page must guide users to a decision, not confuse them with options.
  3.  **Consistency is Key:** The new dashboard and landing page sections must feel like a natural, integrated part of the existing application.

#### **Change Log**

| Date       | Version | Description                          | Author     |
| :--------- | :------ | :----------------------------------- | :--------- |
| 2025-10-20 | 1.0     | Initial draft created from PRD v1.0. | Sally (UX) |

---

### 2. Information Architecture (IA)

#### **Site Map / Screen Inventory**

```mermaid
graph TD
    subgraph Public Site
        A[/ Landing Page] --> C[/login - Magic Link Page];
        A -- "Vendor Login" Button --> M[Login Modal];
        M -- Submits Email --> C;
    end

    subgraph Authenticated App
        C -- Successful Login --> D[/[vendor_slug]/dashboard];
        D --> E[Dishes Management];
        D --> F[Brand Profile Management];
        D --> G[Status Management];
    end

    subgraph External
        A -- "Interested?" FAB --> H[WhatsApp];
    end
```

#### **Navigation Structure**

- **Primary Navigation (Vendor Dashboard):** Once a vendor is logged in, the primary navigation within the `/[vendor_slug]/dashboard` will consist of a simple, clear mechanism (e.g., a sidebar or top tabs) to switch between the three main management areas: "Dishes," "Brand Profile," and "Status."
- **Global Cart Visibility:** The global cart icon will be hidden on the homepage (`/`) and the login page (`/login`), as these are public pages without user-specific cart state.
- **Login Entry Point:** A "Vendor Login" button will be present on the landing page, directing users to the `/login` page.
- **Secondary Navigation:** This will consist of controls within a specific management area, such as "Add New Dish" or "Search Dishes" within the Dishes view.
- **Breadcrumb Strategy:** A breadcrumb trail (e.g., `Dashboard > Dishes > Edit 'Spicy Pizza'`) should be used within the dashboard to ensure the vendor always knows where they are, especially on mobile devices.

---

### 3. User Flows

#### **Flow 1: Premium Lead Generation**

- **User Goal:** To express interest in the premium plan and contact the YumYum team.
- **Entry Points:** Clicking the "Interested?" FAB on the landing page.
- **Success Criteria:** The user successfully opens a pre-filled WhatsApp chat.

##### Flow Diagram

```mermaid
graph TD
    A[User Clicks "Interested?" FAB] --> B[Opens new tab to WhatsApp with pre-filled message];
```

##### Edge Cases & Error Handling:

- N/A for this simplified flow.

---

#### **Flow 2: Vendor Login via Magic Link**

- **User Goal:** To securely access the vendor dashboard.
- **Entry Points:** Clicking the "Vendor Login" button on the landing page (opens modal); or visiting `/login` directly.
- **Success Criteria:** The user is successfully authenticated and redirected to their dashboard.

##### Flow Diagram

```mermaid
graph TD
    A[User Clicks "Vendor Login" on Landing Page] --> B[Login Modal Opens];
    B --> C[Enters email in Modal];
    C --> D[Clicks "Send Magic Link"];
    D --> E{System calls Supabase Auth};
    E --> F[User sees "Check your email" message in Modal];
    subgraph User's Email Client
        G[User opens email] --> H[Clicks unique login link];
    end
    H --> I{User is redirected to the app};
    I --> J[App verifies token];
    J --> K[/[vendor_slug]/dashboard is displayed];
```

##### Edge Cases & Error Handling:

- If the user enters an email not associated with a premium account, an error message will be displayed within the modal. The user can then close the modal to return to the landing page.
- If the magic link has expired, the user will be shown a message and prompted to request a new one.
- The login modal can be dismissed by the user at any time.

---

#### **Flow 3: Update a Dish Price**

- **User Goal:** To quickly change the price of a menu item.
- **Entry Points:** The "Dishes" management view within the vendor dashboard.
- **Success Criteria:** The new price is saved to the database and the UI updates to reflect the change.

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

- If the save operation fails due to a network error, the form should remain open with the user's changes intact, and an error message should be displayed.
- Input validation should prevent a user from saving a non-numeric or negative price.

---

### 4. Wireframes & Mockups

**Primary Design Files:**

- High-fidelity mockups and prototypes will be created and maintained in **Figma**. A link will be added here once the file is created.

#### Main Profile & Menu Screen

- **Purpose:** To serve as the vendor's primary digital storefront. It establishes the brand's identity, provides top-level menu navigation, and allows users to browse all available dishes at a glance.
- **Key Elements:**
  1.  **Brand Header:** (Top of the screen) Contains the vendor's logo, name, cuisine type, bio, and a row of icon-based links (e.g., WhatsApp, payment, location).
  2.  **Category Highlights:** (Below the header) A horizontally-scrolling list of circular category buttons, each with a colored gradient ring, similar to Instagram Stories.
  3.  **Controls Bar:** (Below categories) A simple bar containing the "Veg Only" toggle, a "Sort by Price" control, and a Search input field.
  4.  **Dish Grid:** (Main content area) A responsive 3-column grid of square dish images that fills the rest of the screen.
- **Interaction Notes:** Tapping a category button or a dish card smoothly transitions the user into the full-screen "Reel View". The controls in the `ControlsBar` filter the `DishGrid` instantly on the client-side.

#### Key Screen Layout: Landing Page (`/`)

- **Purpose:** To provide an engaging and informative entry point for prospective vendors, showcasing YumYum's value proposition and highlighting popular vendors.
- **Key Elements:**
  1.  **Login Entry Point:** A "Vendor Login" button in the top-right corner, which triggers a modal containing the login form.
  2.  **Hero Section:** Prominent display of YumYum's core value.
  3.  **Top Vendors Section:** A section displaying cards for the top 10 most visited vendors, including their name, cuisine, and logo, linking to their respective public pages.
  4.  **Marketing Sections:** Various sections detailing "How It Works," "Why Yumyum," "Vendor Stories," "Premium Marketing," "Tier Comparison," "How to Join," "FAQ," "About," and "Conversion."
  5.  **Interest CTA:** A Floating Action Button (FAB) for quick contact via WhatsApp.
  6.  **Footer:** Standard footer with links and copyright information.
- **Interaction Notes:** The page is designed for clear navigation and calls-to-action, guiding users through the sales funnel.

#### **Key Screen Layout: Vendor Dashboard (`/[vendor_slug]/dashboard`)**

- **Purpose:**
  To provide a central, simple, and efficient hub for vendors to manage all aspects of their digital storefront without leaving the application.

- **Key Elements:**
  1.  **Main Navigation:** A simple and clear tab-based navigation bar at the top of the screen with three items: "Dishes," "Brand Profile," and "Status."
  2.  **Content Area:** The main body of the page, which will render the appropriate management interface based on the selected tab.
  3.  **Primary Action Button:** A floating action button (e.g., a "+" icon) at the bottom right of the screen, which will serve as the "Add New Dish" or "Add New Status" button.
  4.  **User/Logout Control:** A user profile icon in the top-right header that opens a small dropdown with a "Logout" option.

- **Interaction Notes:**
  Tapping a tab instantly switches the view in the Content Area. The interface will use client-side routing, making the transition feel fast and app-like.

---

### 5. Component Library / Design System

- **Design System Approach:**
  We will continue to use the project's established component strategy: using **Shadcn UI** for base components, styling with **Tailwind CSS**, and composing new, project-specific components.

---

#### **Core Components (New for Dashboard & Auth)**

- **`DashboardNav`**
  - **Purpose:** To provide the primary tab-based navigation within the vendor dashboard.

- **`DataTable`**
  - **Purpose:** A reusable table component to display lists of data like dishes, including action buttons for "Edit" and "Delete."

- **`EntityForm`**
  - **Purpose:** A generic form component for creating/editing dishes, brand info, and statuses, including the ImageKit image uploader.

- **`LoginFormContent`**
  - **Purpose:** A reusable component encapsulating the email input and magic link sending logic for vendor login.

---

### 6. Branding & Style Guide

- **Visual Identity:**
  - We will continue to follow the established brand guidelines. The aesthetic is clean, modern, and "food-centric."

- **Color Palette:**
  - The existing project color palette will be used for all new components.

| Color Type   | Hex Code  | Usage                      |
| :----------- | :-------- | :------------------------- |
| Background   | `#FEF3E2` | App base, page backgrounds |
| Primary      | `#FAB12F` | Main CTAs, active states   |
| Text Primary | `#111827` | Default body content       |

- **Typography:**
  - **Font Families:** We will continue to use **Inter**.

- **Iconography:**
  - **Icon Library:** We will continue to use **Lucide Icons** exclusively.

---

### 7. Accessibility Requirements

- **Compliance Target:**
  - **Standard:** WCAG 2.1 Level AA. This is a non-negotiable requirement.

- **Key Requirements:**
  - All functionality must be keyboard navigable.
  - All controls must have appropriate ARIA labels.
  - All images must have descriptive `alt` text.

- **Testing Strategy:**
  - A combination of automated checks (`axe-core`) and manual keyboard/screen reader testing.

---

### 8. Responsiveness Strategy

- **Breakpoints:**
  - We will continue to use the project's standard breakpoints (Mobile < 768px, Tablet >= 768px, Desktop > 1024px).

- **Adaptation Patterns for the Vendor Dashboard:**
  - The dashboard will use a collapsible sidebar or top tab bar for navigation on mobile.
  - Data tables will reflow into a card-based list view on mobile screens to avoid horizontal scrolling.

---

### 9. Animation & Micro-interactions

- **Motion Principles:**
  - Animations must prioritize clarity and speed over elaborate effects.

- **Key Animations for New Features:**
  - **Form Feedback:** Buttons will have loading/success/error states.
  - **List Item Deletion:** Items will fade out smoothly on deletion.
  - **Drawer Transitions:** The "Interested?" drawer will slide in smoothly.

---

### 10. Performance Considerations

- **Performance Goals:**
  - The public landing page must maintain an LCP of under 2.5 seconds.
  - Dashboard interactions must feel instant (<100ms response).

- **Design Strategies for Performance:**
  - Leverage Next.js code splitting for the authenticated dashboard routes.
  - Continue to use ImageKit for all image optimization.
  - Implement a client-side caching strategy for dashboard data to ensure fast subsequent loads.

---

### 11. Next Steps

- **Immediate Actions:**
  1.  **Stakeholder Review:** This UI/UX Specification document should be shared for final approval.
  2.  **High-Fidelity Design:** Begin creating detailed mockups and interactive prototypes in Figma.
  3.  **Developer Handoff:** This document and the Figma designs will be handed off to the Architect and Development team to begin implementation.

- **Design Handoff Checklist:**
  - [x] All user flows documented
  - [x] Component inventory complete
  - [x] Accessibility requirements defined
  - [x] Responsive strategy clear
  - [x] Brand guidelines incorporated
  - [x] Performance goals established
