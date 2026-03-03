import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from './api';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  constructor(private http: HttpClient, private auth: AuthService) {}

  async register(email: string, password: string) {
    const resp = await firstValueFrom(
      this.http.post<{ token: string }>(`${API_BASE}/auth/register`, { email, password })
    );
    this.auth.setToken(resp.token);
  }

  async login(email: string, password: string) {
    const resp = await firstValueFrom(
      this.http.post<{ token: string }>(`${API_BASE}/auth/login`, { email, password })
    );
    this.auth.setToken(resp.token);
  }

  logout() {
    this.auth.clear();
  }
}