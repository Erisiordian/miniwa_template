import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from '../../core/api';
@Injectable({ providedIn: 'root' })
export class QueryService{
  constructor(private http: HttpClient){}
  run(query: string){ return firstValueFrom(this.http.post(`${API_BASE}/query/run`, { query })); }
}
