import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  readonly form: FormGroup;
  submitted = false;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  sendMessage(): void {
    this.submitted = false;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { name, email, message } = this.form.getRawValue();
    const body = encodeURIComponent(`New website message\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.open(`https://wa.me/201270851932?text=${body}`, '_blank', 'noopener,noreferrer');
    this.submitted = true;
    this.form.reset();
  }
}
