import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ServicesService } from '../../core/services.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  readonly form: FormGroup;
  error = '';

  constructor(public store: ServicesService, private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[+\d\s()-]{8,20}$/)]],
      address: ['', [Validators.required, Validators.minLength(6)]],
      city: ['', Validators.required],
      notes: ['']
    });
    const user = store.currentUser;
    if (user) this.form.patchValue({ fullName: user.name });
  }

  get items() { return this.store.cartItems; }
  get total(): number { return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0); }

  placeOrder(): void {
    if (!this.store.currentUser) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    if (!this.items.length) { this.error = 'Your cart is empty.'; return; }
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const customer = this.form.getRawValue();
    const lines = this.items.map(({ product, quantity }) => `• ${product.title} x${quantity} — EGP ${(product.price * quantity).toFixed(2)}`).join('\n');
    const message = [
      'New order',
      `Customer: ${customer.fullName}`,
      `Account: ${this.store.currentUser.email}`,
      `Phone: ${customer.phone}`,
      `Address: ${customer.address}, ${customer.city}`,
      '', 'Items:', lines, '',
      `Total: EGP ${this.total.toFixed(2)}`,
      customer.notes ? `Notes: ${customer.notes}` : ''
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/201270851932?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }
}
