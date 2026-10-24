import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop-by-category',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shop-by-category.component.html',
  styleUrl: './shop-by-category.component.css'
})
export class ShopByCategoryComponent implements OnInit {
  categories: { name: string; slug: string; image: string }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('https://dummyjson.com/products?limit=0').subscribe(({ products }) => {
      const byCategory = new Map<string, any[]>();
      products.forEach((product: any) => {
        const items = byCategory.get(product.category) ?? [];
        items.push(product);
        byCategory.set(product.category, items);
      });

      this.categories = this.shuffle([...byCategory.entries()])
        .slice(0, 6)
        .map(([slug, items]) => ({
          slug,
          name: slug.replace(/-/g, ' '),
          image: this.shuffle([...items])[0].thumbnail
        }));
    });
  }

  private shuffle<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
}
