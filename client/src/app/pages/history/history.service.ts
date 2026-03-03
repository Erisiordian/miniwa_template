import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from '../../core/api';

@Injectable({ providedIn: 'root' })
export class HistoryService{
  constructor(private http: HttpClient){}
  list(limit = 20){
    return firstValueFrom(this.http.get(`${API_BASE}/history`, { params: { limit } as any }));
  }
}
