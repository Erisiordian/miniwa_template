import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApi } from '../../core/auth.api';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage {
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private api: AuthApi, private router: Router) {}

  async login() {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.api.login(this.email().trim(), this.password());
      this.router.navigateByUrl('/history');
    } catch (e: any) {
      this.error.set(e?.error?.message || e?.message || 'Login failed');
    } finally {
      this.loading.set(false);
    }
  }
}
