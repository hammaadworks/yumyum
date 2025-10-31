# 404 Page Design Thoughts

This document captures the design decisions and requirements for the application's 404 "Not Found" page, based on stakeholder feedback.

## 1. Overall Tone

*   **Humorous and Playful:** The tone should be light-hearted and relatable to the YumYum app's food-centric business and the value it brings. Avoid a dry or overly technical message.

## 2. Content & Functionality

*   **Primary Message:** A humorous, food-themed message indicating the page was not found (e.g., "Oops! Looks like this dish went missing from the menu!" or "Our chef couldn't find this page in the pantry.").
*   **Explanation:** A brief, friendly explanation of what might have happened.
*   **Call-to-Action (CTA):**
    *   **"Go Home" Button:** A clear button to navigate back to the application's homepage (`/`).
    *   **Search Bar:** A prominent search bar that allows users to fuzzy match with:
        *   Partnered vendor names
        *   Cuisines
        *   Food dishes
*   **Search Results:** The search results must only include the vendor name, cuisine, and on clicking, take the user to their respective menu page (`/[vendor-slug]`).

## 3. Visuals

*   **Aesthetic:** Cool, modern, artistic, and attractive, consistent with the overall YumYum brand.
*   **Brand Elements:** Incorporate YumYum's logo and primary color palette.
*   **Illustration/Image:** A custom, food-themed illustration that is humorous and visually appealing (e.g., a lost ingredient, a chef looking confused, a broken plate). If a custom illustration is not feasible, a relevant Lucide icon or a simple placeholder graphic will be used.
*   **Background:** Consistent with the app's design, perhaps a subtle texture or a clean, inviting background color.

## 4. Accessibility

*   Standard WCAG 2.1 Level AA compliance, as per project standards.

## 5. Technical Implementation

*   **Location:** `src/app/not-found.tsx` (standard Next.js App Router convention).
*   **Rendering:** Client-Side Rendered (CSR) (`'use client';`). This is acceptable as SEO is not a primary concern for a 404 page, and CSR allows for interactive elements like the search bar.

## 6. Reusable Search Component (`PartnerSearch`)

*   The search bar functionality will be encapsulated in a reusable component (e.g., `src/components/shared/PartnerSearch.tsx`).
*   This `PartnerSearch` component will also be integrated into the homepage (`src/app/page.tsx`) to provide the same vendor searching capabilities.

## 7. Handling Non-Existent `/[vendor_slug]` Routes

*   **Problem:** When a user navigates to `/[vendor_slug]` where `vendor_slug` does not correspond to a registered partner.
*   **Solution:** The `src/app/[vendor_slug]/page.tsx` will perform an existence check for the `vendor_slug`. If the vendor is not found, it will call Next.js's `notFound()` function. This will automatically trigger the rendering of our custom `src/app/not-found.tsx` page. This approach is simple, intuitive, and cost-saving, leveraging Next.js's built-in 404 handling without unnecessary API calls or redirects.

---

## Next Steps / Pending Clarifications

To proceed with the implementation of the 404 page and the reusable search functionality, the following clarifications are needed:

1.  **Fuzzy Search API Data Source & Algorithm:**
    *   **Which data should the search API query?** Should it search against:
        *   Only Premium-tier (Supabase) vendors?
        *   Both Premium-tier (Supabase) AND Free-tier (Google Sheets) vendors? (If both, how do we consolidate the data effectively and cost-efficiently for searching?)
    *   **What kind of "fuzzy match" algorithm do you prefer for the API, considering simplicity and cost?**
        *   A simple `LIKE %query%` SQL clause (case-insensitive) for broad matches (low complexity, low cost)?
        *   A more advanced text search (e.g., PostgreSQL `tsvector`/`tsquery` or a dedicated search service) (higher complexity, potentially higher cost)?

2.  **404 Page Illustration:** Do you have a specific illustration image or a description for the humorous food-themed graphic on the 404 page? If not, a placeholder or simple Lucide icon will be used.

3.  **Location of `PartnerSearch` on Homepage:** Where specifically on the homepage (`src/app/page.tsx`) should the `PartnerSearch` component be placed? (e.g., within the `HeroSection`, as a new standalone section, or in the header?)

---

1. 404
2. commit
3. upgrade next
4. insert test data
5. do the featured section setup
6. run review check
7. test
8. commit 
9. PWA
10. 