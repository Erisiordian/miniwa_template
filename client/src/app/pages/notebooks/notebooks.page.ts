import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from '../../core/api';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './notebooks.page.html',
  styleUrls: ['./notebooks.page.css'],
})
export class NotebooksPage {
  loading = signal(false);
  items = signal<any[]>([]);
  error = signal<string | null>(null);
  title = '';

  constructor(private http: HttpClient, private router: Router) {
    this.load();
  }

  async load() {
    this.loading.set(true); this.error.set(null);
    try {
      const data = await firstValueFrom(this.http.get<any[]>(`${API_BASE}/notebooks`));
      this.items.set(data);
    } catch (e: any) {
      this.error.set(e?.error?.message || e?.message || 'Failed');
    } finally {
      this.loading.set(false);
    }
  }

  async create() {
    this.loading.set(true); this.error.set(null);
    try {
      const doc = await firstValueFrom(this.http.post<any>(`${API_BASE}/notebooks`, { title: 'New notebook', content: '' }));
      this.router.navigateByUrl(`/notebooks/${doc._id}`);
    } catch (e: any) {
      this.error.set(e?.error?.message || e?.message || 'Failed');
    } finally {
      this.loading.set(false);
    }
  }

  async remove(id: string) {
    if (!confirm('Delete notebook?')) return;
    this.loading.set(true); this.error.set(null);
    try {
      await firstValueFrom(this.http.delete(`${API_BASE}/notebooks/${id}`));
      await this.load();
    } catch (e: any) {
      this.error.set(e?.error?.message || e?.message || 'Failed');
    } finally {
      this.loading.set(false);
    }
  }
}
