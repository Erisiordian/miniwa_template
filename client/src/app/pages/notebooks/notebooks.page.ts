import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotebooksService } from './notebooks.service';
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notebooks.page.html',
  styleUrl: './notebooks.page.css',
})
export class NotebooksPage{
  loading=signal(false); error=signal<string|null>(null);
  items=signal<any[]>([]); title=signal('');
  constructor(private ns: NotebooksService){ this.load(); }
  async load(){
    this.loading.set(true); this.error.set(null);
    try{ this.items.set(await this.ns.list() as any[]); }
    catch(e:any){ this.error.set(e?.error?.message || e?.message || 'Failed'); }
    finally{ this.loading.set(false); }
  }
  async create(){
    const t=this.title().trim(); if(!t) return;
    this.loading.set(true);
    try{ await this.ns.create(t); this.title.set(''); await this.load(); }
    finally{ this.loading.set(false); }
  }
  async remove(id:string){
    this.loading.set(true);
    try{ await this.ns.remove(id); await this.load(); }
    finally{ this.loading.set(false); }
  }
}
