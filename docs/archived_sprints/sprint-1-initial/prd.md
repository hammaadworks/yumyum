# YumYum Product Requirements Document (PRD)

## 1. Goals and Background Context

#### **Goals**
*   Validate product-market fit by onboarding 5+ paying vendors within one month.
*   Prove the core value proposition by achieving a 0% churn rate in the first month.
*   Confirm technical stability and usability of the core product loop.
*   Establish a "Build in Public" brand strategy to drive organic growth and attract opportunities.

#### **Background Context**
YumYum is a mobile-first digital menu platform designed for hyperlocal food vendors who are currently underserved by complex, expensive digital solutions. The project aims to solve the key problems of static printed menus—namely high costs, missed upselling opportunities, and a lack of customer data—by providing a beautiful, easy-to-manage digital storefront. The core premise is that by leveraging familiar tools like Google Sheets and WhatsApp, we can deliver a "radically simple" yet powerful tool that provides immediate ROI to vendors and a modern, engaging experience for their customers.

#### **Change Log**

| Date       | Version | Description                               |
| :--------- | :------ | :---------------------------------------- |
| 2025-10-10 | 1.0     | Initial draft created from Project Brief. |
| 2025-10-10 | 2.0     | Major course correction to expand MVP scope and UI/UX vision. |

---

## 2. Requirements (v2)

#### **Functional Requirements**

*   **FR1:** The system shall allow a vendor to manage their complete menu via a structured Google Sheet.
*   **FR2:** The system shall generate a unique, publicly accessible brand page for each vendor based on a `vendor_slug`.
*   **FR3:** The brand page shall display the menu in a responsive, 3-column grid of dish images.
*   **FR4:** Clicking a dish in the grid shall open a full-screen, vertical-scrolling "Reel View".
*   **FR5:** Users shall be able to add an item to the cart by double-tapping it in the "Reel View".
*   **FR6:** End-users shall be able to trigger an order by sending the formatted cart contents to the vendor's specified WhatsApp number.
*   **FR7:** The system shall provide a downloadable QR code that links directly to the vendor's brand page.
*   **FR8:** The system shall include a feedback mechanism allowing users to provide a star rating (1-5).
*   **FR9:** If the feedback rating is high (≥ 4 stars), the system shall prompt the user to leave a review on the vendor's specified social media page.
*   **FR10:** The system shall provide a `/vendor/upload` page allowing vendors to upload images/videos to ImageKit and receive a URL.
*   **FR11:** A "Veg Only" toggle in the UI shall filter the `Dishes` list on the client-side.
*   **FR12:** The UI shall provide a mechanism to sort the menu by price (low-to-high / high-to-low).
*   **FR13:** A biweekly scheduled job shall run to find and delete any media in ImageKit that is no longer referenced in any vendor's Google Sheet.
*   **FR14:** The system shall filter items based on the `instock` field. Items marked `hide` will not be fetched. Items marked `no` will be displayed last in any list and visually greyed out.

#### Non-Functional Requirements

*   **NFR1:** The application UI must be mobile-first and fully responsive.
*   **NFR2:** The application must provide a "blazing-fast," app-like user experience with minimal load times.
*   **NFR3:** The UI must have a premium, polished aesthetic, leveraging the specified UI libraries.
*   **NFR4:** The backend data source must be a public Google Sheet, accessed via the `gviz/tq?tqx=out:csv` URL endpoint.
*   **NFR5:** All vendor media (images, videos) must be hosted on ImageKit.
*   **NFR6:** The system must use Google Analytics 4 for event tracking, configured with a `vendor_id` custom dimension.
*   **NFR7:** The system must attempt to detect network status and provide an offline fallback experience (feasibility to be determined by an architectural spike).
*   **NFR8:** The architecture must include a serverless cron job capability (e.g., GitHub Action, Vercel Cron) to execute the biweekly maintenance script.
*   **NFR9:** The application must meet the **WCAG 2.1 Level AA** accessibility standard.
*   **NFR10:** The system must send critical event alerts to a configurable Lark webhook URL.

---

## 3. Data Models (Google Sheets Structure) v8

*   **`brand` Tab:**
    | Column | Optionality | Description |
    | :--- | :--- | :--- |
    | `name` | Required | The display name of the brand. |
    | `logo_url` | Required | URL for the brand's logo. |
    | `cuisine` | Required | Type of cuisine (e.g., "South Indian"). |
    | `description`| Required | A short bio for the brand. |
    | `payment_link`| Required | UPI or other payment deep link. |
    | `whatsapp` | Required | The number for receiving WhatsApp orders. |
    | `contact` | Required | A primary contact phone number. |
    | `location_link`| Optional | Google Maps link to the vendor's location. |
    | `review_link`| Optional | The direct link for customers to leave a review. |
    | `instagram` | Optional | Link to Instagram profile. |
    | `facebook` | Optional | Link to Facebook page. |
    | `youtube` | Optional | Link to YouTube channel. |
    | `custom` | Optional | A custom link (will use a generic 'link' icon). |
    | `full_menu_pic`| Optional | URL to a single, static image of the full menu for offline fallback. |

*   **`dishes` Tab:**
    | Column | Description |
    | :--- | :--- |
    | `id` | **System-Generated.** A unique, stable, URL-friendly identifier (e.g., "spicy-paneer-pizza"). Automatically created from the `name`. This is not a column in the Google Sheet but is added to the data model upon fetch. |
    | `category` | The menu category this dish belongs to. |
    | `name` | The name of the dish. Used to generate the `id`. |
    | `image` | URL for the primary dish image. |
    | `reel` | (Optional) URL for a short video/reel of the dish. |
    | `description`| A short, appealing description. |
    | `price` | The price of the item. |
    | `instock` | Availability. Must be one of: `yes`, `no`, `hide`. |
    | `veg` | Dietary info. Must be one of: `veg`, `non-veg`. |
    | `tag` | (Optional) Special tag. One of: `bestseller`, `chef's special`, `new`, `limited edition`, `normal`. |

*   **`Admin_Config` Sheet:**
    *   **`vendors` tab:**
        | Column | Description |
        | :--- | :--- |
        | `slug` | The vendor slug used in the URL. |
        | `sheet_id` | The ID of the vendor's individual Google Sheet. |
        | `imagekit_account_id` | The ID that maps to a specific ImageKit account (e.g., `ik_acc_1`). |

*   **Technical Note on Secrets:** All sensitive credentials, including ImageKit API keys and secrets for the multiple accounts, will be stored securely as environment variables (`.env` file) and mapped using the `imagekit_account_id`.

*   **Other Tabs:** `Status` as previously defined.

---

## 4. User Interface Design Goals v5

*   **Overall UX Vision:** The UI will replicate the familiar experience of an **Instagram profile page**, transformed into an interactive menu. It must be intuitive, performant, and visually polished.
*   **Key Interaction Paradigms:**
    *   **The Bio Header:** Features the vendor's logo (with status bubble), name, cuisine, bio, and conditionally rendered contact/social links.
    *   **Category Highlights:** A horizontal, scrollable list of circular buttons for each menu category.
    *   **Navtab Icons:** A main navigation bar containing a Cart button, a "Veg Only" toggle, and Search/Sort functionality.
    *   **Dish Grid:** A 3-column grid of dish images. Dishes with a `tag` will have a yellow pulsing dot overlay.
    *   **Full-Screen Reel View:** Clicking a dish opens a vertical-scrolling "reel" interface. Users can double-tap to add to cart, long-press to play video, and open a description drawer. The Sort and Veg-Toggle controls must also be present on this view.
*   **Accessibility:** The application **must** meet the **WCAG 2.1 Level AA** standard.
*   **Branding:** The UI will use modern component libraries (Shadcn UI, Aceternity, Magic UI, React Bits, Pattern Craft, Unicorn Studio) to achieve a premium feel.

---

## 5. Technical Assumptions v2

*   **Framework:** Latest **stable** version of Next.js and React.
*   **Repository Structure:** Monorepo (managed with pnpm).
*   **Service Architecture:** Primarily client-side rendering. Data fetching occurs once on page load and is held in an in-memory state. No server-side computation for user-facing views.
*   **Backend Processes:** A single serverless cron job (e.g., GitHub Action) is permitted for the biweekly ImageKit pruning script.
*   **Testing:** Strategy will focus on Unit and Integration tests for the MVP.

---

## 6. Epic List (v2)

*   **Epic 1: Foundation & Read-Only Profile View**
*   **Epic 2: Full-Screen Reel Experience & Core Ordering**
*   **Epic 3: Advanced Navigation & Filtering**
*   **Epic 4: Vendor Media Uploader**

---

## 7. Epic Details (In Progress)

### Epic 1: Foundation & Read-Only Profile View

*   **Story 1.1: Project & CI/CD Setup**
    *   **Acceptance Criteria:** `pnpm` workspace is configured; Next.js (latest stable) is installed; `shadcn-ui` is installed; Git repo is initialized; Vercel project is linked and deploys on push to `main`; ESLint/Prettier are configured.

*   **Story 1.2: Modular & Resilient Data Service (v7)**
    *   **Description:** Implement a modular, resilient "stale-while-revalidate" data fetching service. Each data type (brand, dishes, status) will be fetched and cached independently with its own configurable TTL. The service will support a multi-level UI fallback strategy for a graceful offline experience.
    *   **Acceptance Criteria:**
        1.  **Modular Caching:** `brand`, `dishes`, and `status` data must be stored in three separate local storage entries, each with its own timestamp.
        2.  **Configurable TTLs:** The cache revalidation times (Time-To-Live) must be configurable, defaulting to: `brand` (10 minutes), `dishes` (5 minutes), and `status` (2 minutes).
        3.  **Stale-While-Revalidate:** For each data type, the service must first return cached data (if available and not expired) for an instant UI load, then trigger a silent background fetch to update the cache.
        4.  **Offline UI Logic - Full Experience:** If `brand` and `dishes` data are available from the cache, the full interactive menu must be rendered. The status indicator is displayed only if `status` data is also available.
        5.  **Offline UI Logic - Fallback Experience:** If only `brand` data is available from the cache (and `dishes` data is missing/stale), the UI must render the `BrandHeader` and display the `full_menu_pic` as a static fallback.
        6.  **Offline UI Logic - Error Page:** In all other scenarios (e.g., `brand` data is missing), a full-page, user-friendly error message must be displayed.
        7.  **Alerting:** All critical fetch failures must trigger an alert to the configured Lark webhook.

**   **Story 1.3: Brand Header UI**
    *   **Description:** Create the main brand header component, which acts as the "bio" section of the vendor's profile page. It will display the vendor's logo, core information, and contact/social media links.
    *   **Acceptance Criteria:**
        1.  A `BrandHeader` component is created that accepts the `brand` data object as a prop.
        2.  The vendor's `logo_url` is displayed as a circular image. The logo has a colored gradient ring around it (similar to an Instagram Story) to indicate a "status" is available to view.
        3.  The vendor's `name`, `cuisine`, and `description` are displayed prominently.
        4.  A container of icon-only buttons is rendered for each of the following fields present in the `brand` data: `payment_link`, `whatsapp`, `contact`, `location_link`, `instagram`, `facebook`, `youtube`, and `custom`.
        5.  Buttons for optional links (e.g., `location_link`, `instagram`) are only rendered if a URL is provided in the data.
        6.  The container for the link icons must wrap its content, allowing the icons to flow into multiple rows on smaller screens.
        7.  All interactive elements (links, buttons) have appropriate `aria-labels` and the component structure follows semantic HTML to meet accessibility standards.

*   **Story 1.4: Category Highlights Bar (v3 - Corrected)**
    *   **Description:** Create the horizontally scrolling bar that displays the menu categories. This component serves as the primary entry point into the "Reel View" for a specific category.
    *   **Acceptance Criteria:**
        1.  A `CategoryHighlights` component is created that receives the full list of dishes.
        2.  A "Specials" category button is displayed as the first item **if and only if** at least one dish has a `tag` other than `normal`.
        3.  The component generates a unique, ordered list of the remaining menu categories.
        4.  Each category is rendered as a circular button with a deterministically generated colored gradient ring.
        5.  The container is a horizontal, scrollable view with the scrollbar hidden. A portion of the next off-screen button is visible as a UX cue.
        6.  Clicking a category button **must trigger the application to enter the full-screen "Reel View"**.
        7.  When the Reel View is launched from a category click, it must start on the first dish belonging to that category (respecting any active sort/filter from the Controls Bar). The implementation of the Reel View itself is handled in Epic 2.

*   **Story 1.5: Controls Bar (v2 - Corrected)**
    *   **Description:** Create the main controls bar that allows users to filter and sort the main dish grid. This bar is positioned between the Category Highlights and the Dish Grid.
    *   **Acceptance Criteria:**
        1.  A `ControlsBar` component is created.
        2.  The bar contains a "Veg Only" toggle switch. The state of this toggle is managed globally.
        3.  The bar contains a "Sort by Price" control. It defaults to "low-to-high" and can be toggled to "high-to-low".
        4.  The bar contains a Search input field. (The search logic itself will be deferred to a later story).

*   **Story 1.6: Dish Grid View (v2 - Corrected)**
    *   **Description:** Create the main grid that displays all dish images. This grid is filtered by the `ControlsBar`.
    *   **Acceptance Criteria:**
        1.  A `DishGrid` component is created. It receives the full list of dishes and the active filter/sort states from the `ControlsBar`.
        2.  The component filters dishes based on the "Veg Only" toggle state.
        3.  The component sorts the filtered dishes based on the "Sort by Price" control state.
        4.  The dishes are rendered in a responsive grid that displays as 3 columns on larger screens and adjusts appropriately for smaller screens.
        5.  Each item is a `DishCard` that displays the dish's image and a pulsing dot indicator if it has a `tag`.
        6.  Clicking a `DishCard` updates the application state to launch the Reel View, starting with the selected dish.

*   **Story 1.7: Global Cart Button**
    *   **Description:** Implement a persistent cart button that is always visible in the top-left corner of the main application views (Bio/Profile and Reels View).
    *   **Acceptance Criteria:**
        1.  A `GlobalCart` component is created.
        2.  The component is displayed in the top-left of the screen layout.
        3.  It contains a cart icon.
        4.  A badge is displayed on the icon showing the current number of items in the cart. The badge should be hidden if the cart is empty.
        5.  Clicking this button initiates the checkout process by opening the "Cart Summary" bottom sheet drawer.

### Epic 2: Full-Screen Reel Experience & Core Ordering

*   **Story 2.1: Reel View Foundation & UI**
    *   **Description:** Build the basic full-screen, glassmorphic view. Implement the vertical scrolling and the logic for handling `instock` status (`hide` vs. `no`).
    *   **Acceptance Criteria:**
        1.  A full-screen `ReelView` component is created that overlays the main page when active.
        2.  The component's background has a "glassmorphic" effect (e.g., a blurred version of the underlying page).
        3.  The view can be dismissed via a close button, returning the user to the main profile page.
        4.  The component renders a vertical list of dishes.
        5.  Dishes with `instock` status of `no` are rendered with a greyed-out effect and are placed at the very end of the list.
        6.  The `GlobalCart` component (from Story 1.7) is visible in the top-left corner.

*   **Story 2.2: Center Media Display**
    *   **Description:** Create the component responsible for displaying the main dish media (video or image) in the center of the Reel View.
    *   **Acceptance Criteria:**
        1.  A `MediaDisplay` component is created that takes a single dish object as a prop.
        2.  If the dish object contains a `reel` URL, the component must render a video player that loops the video automatically.
        3.  The dish's `image` URL must be used as the video's `poster`—a static image shown while the video is loading.
        4.  If the dish object does **not** contain a `reel` URL, the component must render the static `image` instead.
        5.  The media should fill the available center space of the Reel View, maintaining its aspect ratio.

*   **Story 2.3: Top Category Navigator**
    *   **Description:** Build the special 3-item, horizontally-sliding, glass-text category navigator at the top of the Reel View.
    *   **Acceptance Criteria:**
        1.  A `ReelCategoryNavigator` component is created.
        2.  It displays a maximum of three category names at a time: the previous category, the current category, and the next category.
        3.  The component has a "glassmorphic" design, with the text appearing transparent or semi-transparent.
        4.  The current category is displayed in the center and is visually distinct (e.g., brighter white).
        5.  The previous and next categories are displayed to the left and right and are visually faded.
        6.  The user can horizontally swipe this navigator to scroll through the categories.
        7.  The navigator's state is synced with the main vertical scroll of the Reel View (this will be fully implemented in Story 2.6, but the component must be built to support it).

*   **Story 2.4: Right-Side Action Bar & Drawers (v2)**
    *   **Description:** Build the vertical action bar on the right of the Reel View and the distinct "bottom sheet" drawers that are opened by its buttons.
    *   **Acceptance Criteria:**
        1.  A `ReelActionBar` component is created and displayed vertically on the **right** side of the Reel View.
        2.  The bar contains three buttons in the following top-to-bottom order: **Filter**, **Description**, **Share**.
        3.  Clicking the "Filter" button opens a bottom sheet drawer containing the "Sort by Price" and "Veg Only" controls.
        4.  Clicking the "Share" button opens the device's native share drawer, pre-populated with a direct link to the current dish.
        5.  Clicking the "Description" button opens a bottom sheet drawer displaying all relevant dish data, including its `name`, `description`, `price`, and `tag`.
        6.  All drawers can be dismissed by swiping down. The Description drawer can **also** be dismissed by tapping the background area outside the drawer.
        7.  The action bar and the drawers must have a "glassmorphic" design.

*   **Story 2.5: Core Ordering Interaction (v2 - Simplified)**
    *   **Description:** Implement the user interactions for adding items to the cart within the Reel View.
    *   **Acceptance Criteria:**
        1.  Double-tapping the center media display adds the current dish to the cart. This does not remove items.
        2.  A confirmation micro-animation (e.g., a plus icon) appears over the media on successful addition.
        3.  A dedicated "Add to Cart" button is present in the `ReelActionBar`. It acts as a toggle: tapping it adds the item, and tapping it again removes it. The button's visual state updates with micro-animations.
        4.  The number badge on the `GlobalCart` component updates in real-time as items are added or removed.

*   **Story 2.7: Cart Summary UI**
    *   **Description:** Build the adaptive bottom sheet for the cart summary. It will display the list of items, allow for quantity adjustment, and show the total price.
    *   **Acceptance Criteria:**
        1.  Tapping the `GlobalCart` button opens a bottom sheet drawer with an animation.
        2.  The drawer is scrollable to handle long lists of items.
        3.  The drawer's height is adaptive and can expand to fill the full screen if necessary.
        4.  The drawer can be closed by swiping down or tapping an 'X' icon.
        5.  Each item in the list displays the dish name, its price, and +/- controls to adjust the quantity.
        6.  The total price for each item (quantity x price) is displayed.
        7.  A final "Total Order Price" for all items in the cart is displayed prominently.

*   **Story 2.8: Cart Item Swipe Actions**
    *   **Description:** Implement the "swipe-left" gesture on items within the Cart Summary to reveal "Delete" and "See Item" options.
    *   **Acceptance Criteria:**
        1.  In the Cart Summary drawer, swiping left on a line item reveals two buttons: "Delete" and "See Item".
        2.  The swipe gesture is animated and smooth.
        3.  Clicking the "Delete" button removes the item from the cart and updates the cart summary.
        4.  Clicking the "See Item" button opens a small, centered modal.
        5.  The modal displays the dish's image and name.
        6.  The modal can be dismissed (e.g., by a close button or tapping outside of it).

*   **Story 2.9: Checkout CTAs**
    *   **Description:** Implement the three main action buttons at the bottom of the Cart Summary drawer using a primary/secondary visual hierarchy.
    *   **Acceptance Criteria:**
        1.  A prominent, solid, filled-style button for the primary action, "Place Order on WhatsApp," is displayed.
        2.  Two secondary, outline-style buttons, "UPI Pay" and "Leave a rating," are displayed below the primary button.
        3.  Clicking "Place Order on WhatsApp" opens WhatsApp with a pre-formatted message of the final order.
        4.  Clicking "UPI Pay" opens the payment link specified in the vendor's `brand` data (`payment_link`).
        5.  Clicking "Leave a rating" initiates the "Smart Feedback" funnel (to be built in Epic 3).

*   **Story 2.6: Infinite Loop & State Sync**
    *   **Description:** Implement the logic for the infinite category loop within the Reel View and sync the `ReelCategoryNavigator` at the top with the user's vertical scroll position.
    *   **Acceptance Criteria:**
        1.  As the user scrolls vertically through dishes in the `ReelView`, when they pass the last dish of a category, the next dish loaded is the first dish of the subsequent category.
        2.  After the last dish of the final category, the loop continues seamlessly to the first dish of the very first category.
        3.  As the user scrolls, the `ReelCategoryNavigator` at the top must update in real-time to highlight the category of the dish currently in the viewport.
        4.  The scroll position of the top `ReelCategoryNavigator` must also update, keeping the active category centered.

### Epic 3: Advanced Navigation & Filtering

*   **Story 3.1: Frictionless Feedback Funnel**
    *   **Description:** Implement the "Frictionless Feedback" funnel, triggered from the checkout page. This feature is designed to be simple and highly engaging, using excellent micro-interactions. It intelligently routes customers to the appropriate channel based on their rating: high ratings are directed to the vendor's public Google Review page to boost their reputation, while low ratings are captured privately via WhatsApp.
    *   **Acceptance Criteria:**
        1.  The checkout page (from Story 2.9) contains the entry point for leaving a rating.
        2.  Tapping the rating entry point displays a view with a 5-star input, enhanced with high-quality micro-animations.
        3.  If the user selects a rating of **4 or 5 stars**, a "Thank You" message is briefly displayed, and they are **immediately** redirected to the vendor's `review_link` (Google Review page).
        4.  If the user selects a rating of **1, 2, or 3 stars**, the application **immediately** opens WhatsApp with a pre-filled message to the vendor's number, ready for private feedback.
        5.  If the user submits a 1-star rating, an alert is sent via the Lark webhook.
        6.  The entire flow from tapping a star to redirection must be seamless and feel instantaneous, with zero friction.

*   **Story 3.2: Client-Side Search Functionality**
    *   **Description:** Implement the client-side logic for the search input field located in the `ControlsBar` (from Story 1.5). This feature allows users to instantly filter the `DishGrid` by typing a search query. The search should be fast, responsive, and match against dish names and descriptions.
    *   **Acceptance Criteria:**
        1.  As the user types into the search input, the `DishGrid` updates in real-time.
        2.  The search is case-insensitive and matches against both the `name` and `description` fields of the dishes.
        3.  The search works additively with other filters (e.g., "Veg Only").
        4.  A "clear" button is present in the search input to erase the query.
        5.  If the search input is cleared, the `DishGrid` reverts to its previous state.

*   **Story 3.3: Instagram-style Status Feature (v2)**
    *   **Description:** Activates the Instagram-style "status story" feature. This connects the `status` tab in the Google Sheet to the vendor's logo. When a status is present, the logo gets a gradient ring, and clicking it opens a full-screen viewer for the status content.
    *   **Technical Note:** The `react-insta-stories` library should be used for the viewer.
    *   **Acceptance Criteria:**
        1.  The data fetching service fetches from the `status` tab on **every page load**.
        2.  If the `status` tab has content, the vendor logo displays the gradient ring.
        3.  Clicking the logo opens a full-screen story viewer.
        4.  The viewer logic must validate each status item. Empty or whitespace-only entries are **ignored**.
        5.  An item is identified as **Media** if it's a valid URL pointing to a imagekit media file.
        6.  Any item not identified as Media is treated as **Text**.
        7.  **Edge Case (Broken Media):** If a media URL fails to load, the story viewer must gracefully skip to the next item after a 2-second timeout, not show a broken icon.
        8.  **Edge Case (Long Text):** Text content should automatically scale down to fit the screen. Excessively long text is truncated with an ellipsis (...).
        9.  Media is displayed for its duration (video) or 10s (image). Text is displayed for 10s on a gradient background.
        10. The viewer auto-progresses and can be dismissed.

*   **Story 3.4: Integrated QR Code Modal**
    *   **Description:** Adds a QR code button to the main `BrandHeader`. Clicking it opens a modal with the vendor's menu QR code and sharing options, replacing the need for a separate page.
    *   **Acceptance Criteria:**
        1.  A QR code icon-button is added to the `BrandHeader` UI (from Story 1.3).
        2.  Clicking this button opens a centered modal overlay.
        3.  The modal displays a large, high-resolution QR code for the vendor's menu URL.
        4.  Below the QR code, a row of buttons provides "Copy Link", "Share" (using native device sharing), and "Download PNG" functionality.
        5.  The modal is fully responsive and can be dismissed easily.

### Epic 4: Vendor Media Uploader

*   **Story 4.1: Public Media Uploader (Multi-Account)**
    *   **Description:** Creates a simple, public `/vendor/upload` page. The uploader will check the `Admin_Config` sheet to determine which of the configured ImageKit accounts to use for that specific vendor.
    *   **Acceptance Criteria:**
        1.  A page exists at `/vendor/upload` that is publicly accessible.
        2.  Before uploading, the system reads the `Admin_Config` to find the vendor's assigned `imagekit_account_id`.
        3.  The system uses the corresponding environment variables (e.g., `IMAGEKIT_[ID]_KEY`) to authenticate with the correct ImageKit account.
        4.  On upload, the file is sent to the assigned ImageKit account. If the upload fails, an alert is sent via the Lark webhook.
        5.  The public URL is then displayed on-screen with a "Copy URL" button.

*   **Story 4.2: ImageKit Pruning Cron Job (Multi-Account)**
    *   **Description:** Implements a biweekly automated script to delete any media from our ImageKit accounts that is no longer referenced in any vendor\'s Google Sheet. The script will run across all configured ImageKit accounts.
    *   **Acceptance Criteria:**
        1.  The script loads credentials for all configured ImageKit accounts from environment variables.
        2.  The script iterates through each ImageKit account, performing the pruning logic only for the vendors assigned to that account.
        3.  The script is configured to run at **3 AM every other Saturday**.
        4.  The script produces **traceable logs** for each run.
        5.  Upon completion or failure, the script sends a status alert (including number of files deleted) via the Lark webhook.

*   **Story 4.3: Basic Offline Fallback**
    *   **Description:** Implements a basic offline fallback to improve the user experience on subsequent visits with no network connection. It stores a single, static menu image from the `full_menu_pic` field in the browser's persistent storage.
    *   **Acceptance Criteria:**
        1.  On the first successful page load, if a `full_menu_pic` URL is present in the brand data, the application saves this image to the browser's persistent storage (e.g., IndexedDB).
        2.  When a user revisits the page with no network connectivity, the application detects the offline status.
        3.  Instead of a browser error, the page displays the saved static menu image with a message like "You are currently offline. Here is a static version of the menu."

---