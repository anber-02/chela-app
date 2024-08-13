export interface Product {
  id:           number;
  product_name: string;
  price:        number;
  description:  string;
  stock:        number;
  is_active:    boolean;
  image:        string;
  created_at:   Date;
  updated_at:   Date;
}
