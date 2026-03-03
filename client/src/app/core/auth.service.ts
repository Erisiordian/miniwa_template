import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'miniwa_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  token = this._token.asReadonly();

  isLoggedIn() {
    return !!this._token();
  }

  getToken() {
    return this._token();
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
  }

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
  }
}
