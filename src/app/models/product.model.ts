export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
