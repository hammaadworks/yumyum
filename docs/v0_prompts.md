You are an expert front-end developer specializing in Next.js, TypeScript, and modern UI libraries. Your task is to build the initial set of components for a new project called "YumYum," a digital menu platform.

**1. High-Level Goal:**

Your goal is to create the primary "Profile & Menu" page. This page serves as the vendor's main digital storefront, displaying their brand information, menu categories, and a grid of all their dishes. The design must be mobile-first, responsive, and visually polished, drawing heavy inspiration from the Instagram profile page UI.

**2. Detailed, Step-by-Step Instructions:**

**A. Setup & Tech Stack:**
- The project uses **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.
- The primary UI component library is **Shadcn UI**. You must use its components wherever possible (e.g., for buttons, toggles, etc.).
- Icons must be from the **Lucide Icons** library.

**B. Data Structures (Assume these types are available):**
```typescript
// From docs/prd.md
type Brand = {
  name: string;
  logo_url: string;
  cuisine: string;
  description: string;
  payment_link: string;
  whatsapp: string;
  contact: string;
  location_link?: string;
  review_link?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  custom?: string;
};

type Dish = {
  category: string;
  name: string;
  image: string;
  reel?: string;
  description: string;
  price: number;
  instock: 'yes' | 'no' | 'hide';
  veg: 'veg' | 'non-veg';
  tag?: 'bestseller' | "chef's special" | 'new' | 'limited edition' | 'normal';
};
```

**C. Component Implementation:**

1.  **`BrandHeader` Component (`components/brand-header.tsx`):**
    *   Accepts a `brand: Brand` object as a prop.
    *   Display the `logo_url` in a circular `<img>` tag.
    *   Display `name`, `cuisine`, and `description` as text.
    *   Render a container of icon-only buttons for all provided links (`payment_link`, `whatsapp`, `location_link`, etc.). Use appropriate Lucide icons for each link. This container must wrap its content on small screens.

2.  **`CategoryHighlights` Component (`components/category-highlights.tsx`):**
    *   Accepts `dishes: Dish[]` as props.
    *   It should first derive a unique, ordered list of categories from the `dishes` array.
    *   Render this list as a horizontally-scrolling container (hide the scrollbar).
    *   Each category should be a circular button, similar to an Instagram Story highlight.

3.  **`ControlsBar` Component (`components/controls-bar.tsx`):**
    *   Create a container component.
    *   Inside, include a Shadcn UI `Switch` component for a "Veg Only" toggle.
    *   Include a Shadcn UI `Button` for "Sort by Price".
    *   Include a Shadcn UI `Input` with a `Search` icon for the search field.

4.  **`DishGrid` Component (`components/dish-grid.tsx`):**
    *   Accepts `dishes: Dish[]` as props.
    *   Render the dishes in a responsive grid that is 2 columns on mobile and 3 columns on tablet/desktop.
    *   Each item in the grid should be a square `DishCard` that primarily displays the dish's `image`.
    *   If a dish has a `tag`, display a small, yellow, pulsing dot overlay on the top-right of the `DishCard`.

5.  **Assemble the Main Page (`app/page.tsx`):**
    *   Create the main page component.
    *   Assume you have `brandData: Brand` and `dishData: Dish[]` available as props or from a data fetch.
    *   Structure the page layout vertically in this order: `BrandHeader`, `CategoryHighlights`, `ControlsBar`, `DishGrid`.
    *   The entire page should have a neutral background color.

**3. Code Examples, Data Structures & Constraints:**

*   **Color Palette:**
    *   Primary CTA / Active State: `#FF6B00` (Energetic Orange)
    *   Headlines / Dark Text: `#2A2A2A`
    *   Special Tag Highlight: `#FFD700` (Vibrant Gold)
    *   Background: `#F8F9FA` (Neutral Light Gray)
*   **Typography:** Use the `Inter` font.
*   **Constraint:** Do NOT implement the logic for filtering or sorting yet. Focus only on creating the static UI components and laying them out correctly.
*   **Constraint:** Do NOT implement the "Reel View" or any modals. The buttons in `CategoryHighlights` and cards in `DishGrid` can be simple `<div>`s for now.

**4. Strict Scope:**

*   You should only create the files listed above: `app/page.tsx` and the four components inside the `components/` directory.
*   Do not modify any other files.
*   Do not add any routing or data-fetching logic. This task is purely about UI component creation and layout.
