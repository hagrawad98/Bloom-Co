import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../../core/services.service';

@Component({
  selector: 'app-wishlist', standalone: true, imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html', styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  constructor(public store: ServicesService) {}
  get items() { return this.store.wishlistItems; }
}
