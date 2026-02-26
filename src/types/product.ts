export interface Product {
  _id: string;
  title: string;
  price: number;
  images: string[];
  colors: string[];
  models?: string[];
  badge?: string;
}