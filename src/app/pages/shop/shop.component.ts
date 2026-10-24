import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ErrorComponent } from '../../shared/components/error/error.component';
import { finalize, switchMap } from 'rxjs';
import { ServicesService } from '../../core/services.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrorComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  isLoadingProducts = true;
  totalProducts = 0;
  readonly pageSize = 25;
  currentPage = 1;

  private allProducts: any[] = [];
  private filteredProducts: any[] = [];
  selectedCategory = 'All Products';
  currentPrice = 5000;
  searchQuery = '';
  sortBy = '';

  private apiUrl = 'https://dummyjson.com/products';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private store: ServicesService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.selectedCategory = params.get('category') || 'All Products';
      this.searchQuery = (params.get('q') || '').trim().toLowerCase();
      this.currentPage = 1;
      this.applyFilters();
    });

    this.http.get<any>(this.apiUrl).pipe(
      switchMap((res) => this.http.get<any>(`${this.apiUrl}?limit=${res.total}`)),
      finalize(() => this.isLoadingProducts = false)
    ).subscribe((res) => {
      // Shuffle once on load so pagination stays stable while moving between pages.
      this.allProducts = [...res.products].sort(() => Math.random() - 0.5);
      this.applyFilters();
    });
    this.getCategories();
  }

  get pageNumbers(): number[] {
    return Array.from({ length: Math.ceil(this.totalProducts / this.pageSize) }, (_, i) => i + 1);
  }

  getCategories(): void {
    this.http.get(`${this.apiUrl}/categories`).subscribe((res: any) => {
      this.categories = res;
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentPage = 1;
    this.applyFilters();
  }

  onSort(event: Event): void {
    this.sortBy = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onPriceChange(event: Event): void {
    const selectedPrice = Number((event.currentTarget as HTMLInputElement).value);
    if (!Number.isFinite(selectedPrice)) return;

    this.currentPrice = selectedPrice;
    this.currentPage = 1;
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageNumbers.length) return;
    this.currentPage = page;
    this.updateVisibleProducts();
  }

  private applyFilters(): void {
    this.filteredProducts = this.allProducts.filter((product) => {
      const matchesCategory = this.selectedCategory === 'All Products' || product.category === this.selectedCategory;
      const matchesSearch = !this.searchQuery || product.title.toLowerCase().includes(this.searchQuery);
      const matchesPrice = Number(product.price) <= this.currentPrice;
      return matchesCategory && matchesSearch && matchesPrice;
    });

    if (this.sortBy === 'price-asc') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    }

    this.totalProducts = this.filteredProducts.length;
    const lastPage = Math.max(1, Math.ceil(this.totalProducts / this.pageSize));
    this.currentPage = Math.min(this.currentPage, lastPage);
    this.updateVisibleProducts();
  }

  private updateVisibleProducts(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.products = this.filteredProducts.slice(start, start + this.pageSize);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  addToCart(product: Product): void { this.store.addToCart(product); }
  toggleWishlist(product: Product): void {
    if (this.store.isInWishlist(product.id)) this.store.removeFromWishlist(product.id);
    else this.store.addToWishlist(product);
  }
  isInWishlist(productId: number): boolean { return this.store.isInWishlist(productId); }
}
