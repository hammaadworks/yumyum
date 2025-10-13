import { Dish, Brand } from './types';

export const mockDish: Dish = {
  id: 'mock-dish-1',
  category: 'Mock Category',
  name: 'Mock Dish',
  image: 'https://via.placeholder.com/150',
  description: 'A delicious mock dish.',
  price: 10.99,
  instock: 'yes',
  veg: 'veg',
  tag: 'bestseller',
};

export const mockBrand: Brand = {
  name: 'Mock Brand',
  logo_url: 'https://via.placeholder.com/100',
  cuisine: 'Mock Cuisine',
  description: 'The best mock food in town.',
  payment_link: 'https://example.com/pay',
  whatsapp: '1234567890',
  contact: '1234567890',
};