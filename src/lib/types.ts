export interface Brand {
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
  full_menu_pic?: string;
}

export type BackendType = 'supabase' | 'gsheets';

export interface VendorMapping {
  id: number;
  vendor_slug: string; // e.g., 'the-burger-den'
  backend_type: BackendType; // 'supabase' or 'gsheets'
  supabase_project_id?: string; // Which of the 4 Supabase projects
  gsheet_id?: string;
  imagekit_account_id: string; // Which of the 4 ImageKit accounts
  membership_fee: number;
  membership_validity: string; // ISO 8601 date string
  is_member: boolean;
  user_id?: string; // UUID from auth.users
}

export type InStockStatus = 'yes' | 'no' | 'hide';
export type DietaryInfo = 'veg' | 'non-veg';
export type DishTag =
  | 'bestseller'
  | "chef's special"
  | 'new'
  | 'limited edition'
  | 'normal';

export interface Dish {
  id: string;
  category: string;
  name: string;
  image: string;
  reel?: string;
  description: string;
  price: number;
  instock: InStockStatus;
  veg: DietaryInfo;
  tag?: DishTag;
}

export interface StatusItem {
  type: 'image' | 'video' | 'text';
  content: string;
  duration: number;
}

export type Status = StatusItem[];
