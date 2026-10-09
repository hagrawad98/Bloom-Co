import { Component, DestroyRef, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

type Mode = 'login' | 'signup';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  return group.get('password')?.value === group.get('confirmPassword')?.value
    ? null
    : { mismatch: true };
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  mode: Mode = 'login';
  showPassword = false;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  signupForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  constructor() {
    this.route.data
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((d) => (this.mode = (d['mode'] as Mode) ?? 'login'));
  }

  showError(form: 'login' | 'signup', name: string): boolean {
    const c = (form === 'login' ? this.loginForm : this.signupForm).get(name);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  get mismatch(): boolean {
    return this.signupForm.hasError('mismatch') && this.signupForm.controls.confirmPassword.touched;
  }

  onLogin(): void {
    if (this.loginForm.invalid) return this.loginForm.markAllAsTouched();
    console.log('login', this.loginForm.getRawValue()); // TODO: connect to your API
  }

  onSignup(): void {
    if (this.signupForm.invalid) return this.signupForm.markAllAsTouched();
    console.log('signup', this.signupForm.getRawValue()); // TODO: connect to your API
  }

  social(provider: 'google' | 'facebook'): void {
    console.log('social login:', provider); // TODO: connect to your provider
  }
}
