# 5. Technical Assumptions v2

*   **Framework:** Latest **stable** version of Next.js and React.
*   **Repository Structure:** Monorepo (managed with pnpm).
*   **Service Architecture:** Primarily client-side rendering. Data fetching occurs once on page load and is held in an in-memory state. No server-side computation for user-facing views.
*   **Backend Processes:** A single serverless cron job (e.g., GitHub Action) is permitted for the daily Cloudinary pruning script.
*   **Testing:** Strategy will focus on Unit and Integration tests for the MVP.

---
