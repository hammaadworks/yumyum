export type InStockStatus = 'yes' | 'no' | 'hide';
export type DietaryInfo = 'veg' | 'non-veg';
export type DishTag = 'bestseller' | "chef's special" | 'new' | 'limited edition' | 'normal';

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

export interface Dish {
  id: string; // System-Generated from name, not a sheet column
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
