import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../../../core/services.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive ,RouterModule , FormsModule , CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
  searchQuery: string = '';

  constructor(private router: Router, private store: ServicesService) {}
  get cartCount(): number {
    return this.store.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  get wishlistCount(): number {
    return this.store.wishlistItems.length;
  }
  onSearch(): void {
    const query = this.searchQuery.trim();
    if (query) {
      this.router.navigate(['/shop'], {
        queryParams: { q: query }
      });
      this.searchQuery = '';
    }
  }
}
