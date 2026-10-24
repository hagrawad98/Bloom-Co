import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../../core/services.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart', standalone: true, imports: [CommonModule, RouterLink ,FormsModule],
  templateUrl: './cart.component.html', styleUrl: './cart.component.css'
})
export class CartComponent {
  constructor(public store: ServicesService) {}
  get items() { return this.store.cartItems; }
  get subtotal(): number { return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0); }
}
