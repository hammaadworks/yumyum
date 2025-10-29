# Section 17 of 18: Coding Standards

To ensure a high-quality and consistent codebase, all development must adhere to the following standards.

- **Formatting:** All code will be automatically formatted using **Prettier** on save and before commits. This is non-negotiable and ensures a uniform style across the entire project.

- **Linting:** We use **ESLint** to statically analyze the code and find problems. ESLint rules are defined in `eslint.config.mjs` and must be followed.

- **Naming Conventions:**
  - **Components:** `PascalCase` (e.g., `DishCard`, `VendorDashboard`).
  - **Files:** `kebab-case` (e.g., `use-debounce.ts`, `gsheets.ts`).
  - **Functions & Variables:** `camelCase` (e.g., `getDishes`, `vendorId`).
  - **Types & Interfaces:** `PascalCase` (e.g., `VendorMapping`, `Dish`).

- **Component Structure:** All new components should follow the `shadcn/ui` pattern, using `React.forwardRef` and the `cn` utility for merging classes. This ensures consistency and composability.

- **Data Fetching:** All interaction with external or backend services **must** be abstracted into the `/src/services` layer. Components should not contain direct data fetching logic (e.g., `fetch` calls or direct Supabase client calls). They should call service functions instead.

- **Type Safety:** The use of `any` is strictly discouraged. Always define specific types or interfaces for data structures.

---
