import { Product } from "./product.model";

export interface CartItem extends Product {
  quantity: number;
  total: number
}

export interface ShoppingCart {
  items: CartItem[];
  totalAmount: number;
}
