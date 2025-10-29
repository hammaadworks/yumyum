You are an expert front-end developer specializing in Next.js, TypeScript, and modern UI libraries. Your task is to build the initial set of components for a new project called "YumYum," a digital menu platform.

**1. High-Level Goal:**

Your goal is to create the primary "Profile & Menu" page, which is the main digital storefront for a food vendor. This page must be mobile-first, responsive, and visually polished, drawing heavy inspiration from the **Instagram profile page UI**. It will display the vendor's brand information, menu categories as "story highlights," a set of controls, and a grid of all their dishes.

**2. Detailed, Step-by-Step Instructions:**

**A. Setup & Tech Stack:**

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Libraries:** You **must** use **Shadcn UI** for base components (Button, Switch, Input, etc.). Additionally, leverage **Magic UI**, **Aceternity UI**, **React Bits**, and **PatternCraft** to achieve a premium, polished aesthetic and incorporate advanced animations and UI patterns where appropriate, consistent with the project's UI/UX vision.
- **Icons:** All icons **must** be from the **Lucide Icons** library.
- **State Management:** Global state will be managed by **Zustand**.

**B. Data Structures (from `docs/prd.md`):**
You must use these exact TypeScript types. Note the optional fields.

```typescript
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
  id: string; // This is a system-generated, URL-friendly identifier
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

**C. Component Implementation (Follow the structure from `docs/ui-architecture.md`):**

1.  **`BrandHeader` Component (`src/components/shared/brand-header.tsx`):**
    - Accepts a `brand: Brand` object as a prop.
    - Display the `logo_url` in a circular image tag. The logo should have a colored gradient ring around it (similar to an Instagram Story) to indicate a "status" is available to view (though the status logic itself is out of scope for this task).
    - Display `name` (H1), `cuisine` (p), and `description` (p).
    - Render a container of icon-only buttons for all provided links (`payment_link`, `whatsapp`, `location_link`, etc.). Use appropriate Lucide icons for each link (e.g., `Wallet` for payment, `MessageSquare` for WhatsApp, `MapPin` for location).
    - This container of icons must wrap its content gracefully on small screens.

2.  **`CategoryHighlights` Component (`src/components/features/categories/category-highlights.tsx`):**
    - Accepts `dishes: Dish[]` as props.
    - It should derive a unique, ordered list of categories from the `dishes` array.
    - Render this list as a horizontally-scrolling container (scrollbar must be hidden). A portion of the next off-screen button should be visible as a UX cue.
    - Each category should be a circular button with a deterministically generated colored gradient ring, exactly like an Instagram Story highlight.

3.  **`ControlsBar` Component (`src/components/shared/controls-bar.tsx`):**
    - Create a flex container.
    - Inside, include a Shadcn UI `Switch` component with a `Label` for a "Veg Only" toggle.
    - Include a Shadcn UI `Button` for "Sort by Price".
    - Include a Shadcn UI `Input` with a `Search` icon from Lucide inside the input field on the left.

4.  **`DishCard` and `DishGrid` Components (`src/components/features/dishes/`):**
    - **`DishCard.tsx`**: Creates the card for a single dish. It should be a square card that primarily displays the dish's `image`. If a dish has a `tag` other than `'normal'`, display a small, yellow, pulsing dot overlay on the top-right of the card.
    - **`DishGrid.tsx`**: Accepts `dishes: Dish[]` as props. Render the dishes in a responsive grid that is **2 columns on mobile** and **3 columns on tablet/desktop**, using the `DishCard` component for each item.

5.  **Assemble the Main Page (`src/app/[vendor_slug]/page.tsx`):**
    - Create the main page component.
    - Assume you have `brandData: Brand` and `dishData: Dish[]` available.
    - Structure the page layout vertically in this order: `BrandHeader`, `CategoryHighlights`, `ControlsBar`, `DishGrid`.

**3. Code Examples, Data Structures & Constraints:**

- **Color Palette (from `docs/front-end-spec.md`):**
  - Background / App Canvas: `#FEF3E2`
  - Primary CTA / Active State: `#FAB12F` (Main brand orange)
  - Headlines / Dark Text: `#0B0B0B`
  - Special Tag Highlight / Accent: `#FFC857`
  - Card Surface: `#FFFFFF`
- **Typography:** Use the `Inter` font.
- **Overall Aesthetic:** The UI must embody a "premium, polished aesthetic" and "Instagram-inspired UX" with thoughtful micro-interactions and polished animations (though specific animations are out of scope for this initial task).
- **Constraint:** Do **NOT** implement the logic for filtering, sorting, or searching yet. This task is purely about creating the static UI components and laying them out correctly according to the data provided.
- **Constraint:** Do **NOT** implement the "Reel View" or any modals. The buttons in `CategoryHighlights` and cards in `DishGrid` can be simple `<div>`s or non-functional `<button>`s for now.

**4. Strict Scope:**

- You should only create the files listed above within the specified `src/` directory structure.
- Do not modify any other files.
- Do not add any new libraries to the project beyond those explicitly mentioned.
- Do not add any routing or data-fetching logic. This task is purely about UI component creation and layout.
