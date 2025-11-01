# Section 4 of 18: Data Models (v2)

#### `VendorMapping` (in Primary DB)

- **Purpose:** To act as the master directory for all vendors, routing requests to the correct datastore.
- **TypeScript Interface:**

  ```typescript
  export type DataStoreType = 'supabase' | 'gsheets';

  export interface VendorMapping {
    id: number;
    vendor_slug: string;
    auth_user_id?: string; // UUID from auth.users
    datastore_type: DataStoreType;
    datastore_id: string; // Supabase Project ID or GSheet ID
    imagekit_account_id: string;
    is_member: boolean;
    membership_fee: number;
    membership_validity: string; // ISO 8601 date string
    create_time: string;
    modify_time: string;
  }
  ```

#### `VendorPayment` (in Primary DB)

- **Purpose:** For manual bookkeeping of vendor payments.
- **TypeScript Interface:**
  ```typescript
  export interface VendorPayment {
    id: number;
    vendor_id: number; // Foreign Key to VendorMapping.id
    payment: number;
    payment_date: string;
    payment_duration: string;
    create_time: string;
    modify_time: string;
  }
  ```


---

### **In each Vendor-Specific Supabase Project:**

#### `Brand`

- **Purpose:** Represents the vendor's brand identity.
- **TypeScript Interface:**
  ```typescript
export interface Brand {
  id: number;
  auth_user_id: string; // Foreign Key to auth.users.id
  name: string;
  logo_url: string;
  cuisine: string;
  address?: string;
  city?: string;
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
  full_menu_pic?: string;
}
  ```

#### `Dish`

- **Purpose:** Represents a single menu item.
- **TypeScript Interface:**
  ```typescript
  export interface Dish {
    id: number;
    brand_id: number; // Foreign Key to Brand.id
    category: string;
    name: string;
    description: string;
    price: number;
    instock: 'yes' | 'no' | 'hide';
    veg: 'veg' | 'non-veg';
    tag: string;
    image: string;
    reel: string | null;
    created_at: string;
  }
  ```

#### `StatusItem`

- **Purpose:** Represents a single daily status update.
- **TypeScript Interface:**
  ```typescript
  export interface StatusItem {
    id: number;
    brand_id: number; // Foreign Key to Brand.id
    type: 'image' | 'video' | 'text';
    content: string;
    imagekit_file_id?: string; // For deletion from ImageKit
    create_time: string;
  }
  ```

---
