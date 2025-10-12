# 3. Data Models (Google Sheets Structure) v8

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
        | `cloudinary_account_id` | The ID that maps to a specific Cloudinary account (e.g., `cld_acc_1`). |

*   **Technical Note on Secrets:** All sensitive credentials, including Cloudinary API keys and secrets for the multiple accounts, will be stored securely as environment variables (`.env` file) and mapped using the `cloudinary_account_id`.

*   **Other Tabs:** `Status` as previously defined.

---
