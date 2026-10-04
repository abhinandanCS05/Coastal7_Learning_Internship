export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  mrp?: number;
  stock: number;
  category: string;
  subcategory?: string;
  image_url?: string;
  image?: string;
  badge?: string;
  offer?: string;
  rating?: number;
  reviews?: number;
  is_active?: boolean;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product?: Product;
  price?: number;
}

export interface Cart {
  items: CartItem[];
  total?: number;
  subtotal?: number;
}

export interface ApiError {
  detail?: string;
  message?: string;
}
