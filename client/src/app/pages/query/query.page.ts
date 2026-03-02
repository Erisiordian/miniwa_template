import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QueryService } from './query.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './query.page.html',
  styleUrl: './query.page.css',
})
export class QueryPage {
  query = signal('');
  activeTab = signal<'result'|'steps'|'plot'|'json'>('result');
  lastRun = signal<any|null>(null);
  loading = signal(false);
  error = signal<string|null>(null);

  constructor(private qs: QueryService) {}
  setExample(q: string){ this.query.set(q); }

  async run(){
    this.error.set(null);
    const q = this.query().trim();
    if(!q) return;
    this.loading.set(true);
    try{
      const res = await this.qs.run(q);
      this.lastRun.set(res);
      this.activeTab.set('result');
    }catch(e:any){
      this.error.set(e?.error?.message || e?.message || 'Query failed');
    }finally{
      this.loading.set(false);
    }
  }
}
