# 2. Requirements (v2)

### **Functional Requirements**

*   **FR1:** The system shall allow a vendor to manage their complete menu via a structured Google Sheet.
*   **FR2:** The system shall generate a unique, publicly accessible brand page for each vendor based on a `vendor_slug`.
*   **FR3:** The brand page shall display the menu in a responsive, 3-column grid of dish images.
*   **FR4:** Clicking a dish in the grid shall open a full-screen, vertical-scrolling "Reel View".
*   **FR5:** Users shall be able to add an item to the cart by double-tapping it in the "Reel View".
*   **FR6:** End-users shall be able to trigger an order by sending the formatted cart contents to the vendor's specified WhatsApp number.
*   **FR7:** The system shall provide a downloadable QR code that links directly to the vendor's brand page.
*   **FR8:** The system shall include a feedback mechanism allowing users to provide a star rating (1-5).
*   **FR9:** If the feedback rating is high (≥ 4 stars), the system shall prompt the user to leave a review on the vendor's specified social media page.
*   **FR10:** The system shall provide a `/vendor/upload` page allowing vendors to upload images/videos to Cloudinary and receive a URL.
*   **FR11:** A "Veg Only" toggle in the UI shall filter the `Dishes` list on the client-side.
*   **FR12:** The UI shall provide a mechanism to sort the menu by price (low-to-high / high-to-low).
*   **FR13:** A daily scheduled job shall run to find and delete any media in Cloudinary that is no longer referenced in any vendor's Google Sheet.
*   **FR14:** The system shall filter items based on the `instock` field. Items marked `hide` will not be fetched. Items marked `no` will be displayed last in any list and visually greyed out.

### Non-Functional Requirements

*   **NFR1:** The application UI must be mobile-first and fully responsive.
*   **NFR2:** The application must provide a "blazing-fast," app-like user experience with minimal load times.
*   **NFR3:** The UI must have a premium, polished aesthetic, leveraging the specified UI libraries.
*   **NFR4:** The backend data source must be a public Google Sheet, accessed via the `gviz/tq?tqx=out:csv` URL endpoint.
*   **NFR5:** All vendor media (images, videos) must be hosted on Cloudinary.
*   **NFR6:** The system must use Google Analytics 4 for event tracking, configured with a `vendor_id` custom dimension.
*   **NFR7:** The system must attempt to detect network status and provide an offline fallback experience (feasibility to be determined by an architectural spike).
*   **NFR8:** The architecture must include a serverless cron job capability (e.g., GitHub Action, Vercel Cron) to execute the daily maintenance script.
*   **NFR9:** The application must meet the **WCAG 2.1 Level AA** accessibility standard.
*   **NFR10:** The system must send critical event alerts to a configurable Lark webhook URL.

---
