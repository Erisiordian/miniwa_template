import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from '../../core/api';
@Injectable({ providedIn: 'root' })
export class NotebooksService{
  constructor(private http: HttpClient){}
  list(){ return firstValueFrom(this.http.get(`${API_BASE}/notebooks`)); }
  create(title:string){ return firstValueFrom(this.http.post(`${API_BASE}/notebooks`, { title })); }
  remove(id:string){ return firstValueFrom(this.http.delete(`${API_BASE}/notebooks/${id}`)); }
}
