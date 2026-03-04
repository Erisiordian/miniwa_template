import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from './history.service';
@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.css'],
})
export class HistoryPage{
  loading = signal(false);
  items = signal<any[]>([]);
  error = signal<string|null>(null);
  constructor(private hs: HistoryService){ this.load(); }
  async load(){
    this.loading.set(true); this.error.set(null);
    try{ this.items.set(await this.hs.list(20) as any[]); }
    catch(e:any){ this.error.set(e?.error?.message || e?.message || 'Failed'); }
    finally{ this.loading.set(false); }
  }
}
