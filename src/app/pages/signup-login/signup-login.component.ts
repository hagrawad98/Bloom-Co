import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServicesService } from '../../core/services.service';

@Component({
  selector: 'app-signup-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup-login.component.html',
  styleUrl: './signup-login.component.css'
})
export class SignupLoginComponent {
  mode: 'login' | 'signup' = 'login';
  error = '';
  showPassword = false;
  readonly form: FormGroup;

  constructor(private fb: FormBuilder, private store: ServicesService, private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [true]
    });
    if (this.route.snapshot.url.some((segment) => segment.path === 'signup')) this.setMode('signup');
    if (this.store.currentUser) this.goToReturnUrl();
  }

  setMode(mode: 'login' | 'signup'): void {
    this.mode = mode;
    this.error = '';
    if (mode === 'signup') this.form.controls['name'].setValidators([Validators.required, Validators.minLength(2)]);
    else this.form.controls['name'].clearValidators();
    this.form.controls['name'].updateValueAndValidity();
  }

  submit(): void {
    this.error = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { name, email, password } = this.form.getRawValue();
    const result = this.mode === 'signup'
      ? this.store.signUp(name ?? '', email ?? '', password ?? '')
      : { success: this.store.logIn(email ?? '', password ?? ''), message: 'Email or password is incorrect.' };
    if (!result.success) { this.error = result.message ?? 'Unable to continue. Please try again.'; return; }
    this.goToReturnUrl();
  }

  private goToReturnUrl(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/checkout';
    this.router.navigateByUrl(returnUrl.startsWith('/') ? returnUrl : '/checkout');
  }
}
