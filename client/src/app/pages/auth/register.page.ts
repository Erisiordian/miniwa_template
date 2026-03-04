import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApi } from '../../core/auth.api';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css'],
})
export class RegisterPage {
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private api: AuthApi, private router: Router) {}

  async register() {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.api.register(this.email().trim(), this.password());
      this.router.navigateByUrl('/history');
    } catch (e: any) {
      this.error.set(e?.error?.message || e?.message || 'Register failed');
    } finally {
      this.loading.set(false);
    }
  }
}
