export interface DataResponse {
  orders: Order[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

export interface Order {
  id: number;
  total: number;
  status: Status;
  created_at: Date;
  order_detail: OrderDetail[];
  user: User;
}

export interface OrderDetail {
  id: number;
  quantity: number;
  unit_price: number;
  total: number;
  product: Product;
}

export interface Product {
  id: number;
  product_name: string;
  price: number;
  description: string;
  stock: number;
  is_active: boolean;
  image: string;
  created_at: Date;
  updated_at: Date;
}



type Status = "pending" | "in_progress" | "completed";


export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  created_at: Date;
}
