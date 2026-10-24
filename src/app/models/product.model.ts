export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
  discountPercentage?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
