import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private readonly cartStorageKey = 'ecommerce-cart';
  private readonly wishlistStorageKey = 'ecommerce-wishlist';
  private readonly usersStorageKey = 'ecommerce-users';
  private readonly currentUserStorageKey = 'ecommerce-current-user';
  private readonly cartSubject = new BehaviorSubject<CartItem[]>(this.read<CartItem[]>(this.cartStorageKey, []));
  private readonly wishlistSubject = new BehaviorSubject<Product[]>(this.read<Product[]>(this.wishlistStorageKey, []));

  readonly cart$ = this.cartSubject.asObservable();
  readonly wishlist$ = this.wishlistSubject.asObservable();

  get cartItems(): CartItem[] { return this.cartSubject.value; }
  get wishlistItems(): Product[] { return this.wishlistSubject.value; }
  get currentUser(): { name: string; email: string } | null {
    return this.read<{ name: string; email: string } | null>(this.currentUserStorageKey, null);
  }

  signUp(name: string, email: string, password: string): { success: boolean; message?: string } {
    const users = this.read<Array<{ name: string; email: string; password: string }>>(this.usersStorageKey, []);
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const user = { name: name.trim(), email: email.trim().toLowerCase(), password };
    this.write(this.usersStorageKey, [...users, user]);
    this.write(this.currentUserStorageKey, { name: user.name, email: user.email });
    return { success: true };
  }

  logIn(email: string, password: string): boolean {
    const users = this.read<Array<{ name: string; email: string; password: string }>>(this.usersStorageKey, []);
    const user = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
    if (!user) return false;
    this.write(this.currentUserStorageKey, { name: user.name, email: user.email });
    return true;
  }

  logOut(): void {
    try { localStorage.removeItem(this.currentUserStorageKey); } catch { /* Storage may be unavailable. */ }
  }

  addToCart(product: Product): void {
    const existing = this.cartItems.find((item) => item.product.id === product.id);
    const cart = existing
      ? this.cartItems.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...this.cartItems, { product, quantity: 1 }];
    this.saveCart(cart);
  }

  removeFromCart(productId: number): void { this.saveCart(this.cartItems.filter((item) => item.product.id !== productId)); }
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) { this.removeFromCart(productId); return; }
    this.saveCart(this.cartItems.map((item) => item.product.id === productId ? { ...item, quantity } : item));
  }
  addToWishlist(product: Product): void {
    if (!this.isInWishlist(product.id)) this.saveWishlist([...this.wishlistItems, product]);
  }
  removeFromWishlist(productId: number): void { this.saveWishlist(this.wishlistItems.filter((product) => product.id !== productId)); }
  isInWishlist(productId: number): boolean { return this.wishlistItems.some((product) => product.id === productId); }
  moveWishlistItemToCart(product: Product): void { this.addToCart(product); this.removeFromWishlist(product.id); }

  private saveCart(items: CartItem[]): void { this.cartSubject.next(items); this.write(this.cartStorageKey, items); }
  private saveWishlist(items: Product[]): void { this.wishlistSubject.next(items); this.write(this.wishlistStorageKey, items); }
  private read<T>(key: string, fallback: T): T {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; }
    catch { return fallback; }
  }
  private write(key: string, value: unknown): void {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be unavailable. */ }
  }

  constructor() { }
}
