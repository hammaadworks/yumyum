# Section 4 of 18: Data Models (v2)

## `vendor_mappings`

*   **Purpose:** To act as the master directory for all vendors. It will determine whether a vendor's data is on Google Sheets or Supabase and provide the necessary connection info.
*   **TypeScript Interface:**
    ```typescript
    export type BackendType = 'supabase' | 'gsheets';

    export interface VendorMapping {
      id: number;
      vendor_slug: string; // e.g., 'the-burger-den'
      backend_type: BackendType; // 'supabase' or 'gsheets'
      
      // Supabase-specific fields
      supabase_project_id?: string; // Which of the 4 Supabase projects
      
      // Google Sheets-specific fields
      gsheet_id?: string;

      // ImageKit account is common to both
      imagekit_account_id: string; // Which of the 4 ImageKit accounts
    }
    ```

## `Brand`

*   **Purpose:** Represents the vendor's brand identity.
*   **TypeScript Interface:** (No changes from previous version)
    ```typescript
    export interface Brand {
      id: number;
      vendor_id: string; // Foreign Key to auth.users.id
      // ... all other brand fields
    }
    ```

## `Dish`

*   **Purpose:** Represents a single menu item.
*   **TypeScript Interface (Updated):**
    ```typescript
    export interface Dish {
      id: number;
      vendor_id: string; // Foreign Key to auth.users.id
      category: string;
      name: string;
      description: string | null;
      price: number | null;
      instock: 'yes' | 'no' | 'hide' | null;
      veg: 'veg' | 'non-veg' | null;
      tag: string | null;
      image: string | null;
      reel: string | null;
      created_at: string;
    }
    ```

## `Status`

*   **Purpose:** Represents a daily status update.
*   **TypeScript Interface:** (No changes from previous version)
    ```typescript
    export interface Status {
      id: number;
      vendor_id: string; // Foreign Key to auth.users.id
      content: string;
      type: 'image' | 'video' | 'text';
    }
    ```

---
