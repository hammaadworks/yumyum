# Section 16 of 18: Testing Strategy

Our testing strategy follows the "Testing Pyramid" model to ensure a high degree of confidence in our application's stability and correctness.

*   **Tools:**
    *   **Unit & Integration Testing:** Jest & React Testing Library
    *   **End-to-End Testing:** Playwright

## Unit Tests

*   **Scope:** Individual components in isolation, utility functions, and Zustand stores.
*   **Goal:** To verify that the smallest units of our application work as expected. For components, this means testing that they render correctly given specific props. For functions, it means testing their outputs given various inputs.
*   **Location:** `__tests__` directories co-located with the source files.

## Integration Tests

*   **Scope:** The interaction between multiple components that form a single feature. For example, testing the `DishesManagement` feature by simulating a user adding a new dish through the form and verifying that it appears in the data table.
*   **Goal:** To ensure that different parts of a feature are wired together correctly and that data flows between them as expected.
*   **Location:** `__tests__/components/features`

## End-to-End (E2E) Tests

*   **Scope:** Critical user journeys that span multiple pages and features of the application.
*   **Goal:** To simulate a real user's workflow from start to finish and catch issues in the integrated system that unit or integration tests might miss.
*   **Example Flows:**
    1.  **Vendor Login & CRUD:** A vendor successfully logs in via Magic Link, navigates to the dashboard, creates a new dish, updates its price, and then deletes it.
    2.  **Public Page Load:** A public user successfully loads a vendor's page, and the menu items are rendered correctly from the backend.

---
