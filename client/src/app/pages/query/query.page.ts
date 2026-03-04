import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../core/api';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './query.page.html',
  styleUrls: ['./query.page.css'],
})
export class QueryPage {
  query = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  result = signal<any | null>(null);
  objectKeys = Object.keys;

  constructor(private http: HttpClient) {}

  async run() {
    const q = this.query().trim();
    if (!q) return;

    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    try {
      const resp = await this.http
        .post<any>(`${API_BASE}/query`, { query: q })
        .toPromise();

      this.result.set(resp);
    } catch (e: any) {
      this.error.set(e?.error?.message || e?.message || 'Failed');
    } finally {
      this.loading.set(false);
    }
  }
}
