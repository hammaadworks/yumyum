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

export type InStockStatus = 'yes' | 'no' | 'hide';
export type DietaryInfo = 'veg' | 'non-veg';
export type DishTag = 'bestseller' | "chef's special" | 'new' | 'limited edition' | 'normal';

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
  duration?: number;
}

export type Status = StatusItem[];
