import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from '../../core/api';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './notebook-editor.page.html',
  styleUrls: ['./notebook-editor.page.css'],
})
export class NotebookEditorPage {
  id = '';
  loading = signal(false);
  error = signal<string | null>(null);

  title = signal('');
  content = signal('');
  tagsText = signal('');
  attachments = signal<any[]>([]);

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.id = String(this.route.snapshot.paramMap.get('id') || '');
    this.load();
  }

  async load() {
    this.loading.set(true); this.error.set(null);
    try {
      const nb = await firstValueFrom(this.http.get<any>(`${API_BASE}/notebooks/${this.id}`));
      this.title.set(nb.title || '');
      this.content.set(nb.content || '');
      this.tagsText.set((nb.tags || []).join(', '));
      this.attachments.set(nb.attachments || []);
    } catch (e: any) {
      this.error.set(e?.error?.message || e?.message || 'Failed');
    } finally {
      this.loading.set(false);
    }
  }

  async save() {
    this.loading.set(true); this.error.set(null);
    try {
      const tags = this.tagsText().split(',').map(s => s.trim()).filter(Boolean);
      const nb = await firstValueFrom(this.http.put<any>(`${API_BASE}/notebooks/${this.id}`, {
        title: this.title(),
        content: this.content(),
        tags,
      }));
      this.attachments.set(nb.attachments || []);
    } catch (e: any) {
      this.error.set(e?.error?.message || e?.message || 'Failed');
    } finally {
      this.loading.set(false);
    }
  }

  async uploadFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.loading.set(true); this.error.set(null);
    try {
      const form = new FormData();
      form.append('file', file);

      const nb = await firstValueFrom(
        this.http.post<any>(`${API_BASE}/notebooks/${this.id}/attachments`, form)
      );
      this.attachments.set(nb.attachments || []);
      input.value = '';
    } catch (e: any) {
      this.error.set(e?.error?.message || e?.message || 'Upload failed');
    } finally {
      this.loading.set(false);
    }
  }

  downloadExport() {
    // browser will download due to Content-Disposition
    window.open(`${API_BASE}/notebooks/${this.id}/export`, '_blank');
  }
}