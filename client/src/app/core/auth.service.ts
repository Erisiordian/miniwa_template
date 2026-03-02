import { Injectable, signal } from '@angular/core';
type User = { id: string; email: string };
@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSig = signal<string | null>(localStorage.getItem('token'));
  private emailSig = signal<string | null>(localStorage.getItem('email'));
  isAuthed(){ return !!this.tokenSig(); }
  token(){ return this.tokenSig(); }
  userEmail(){ return this.emailSig(); }
  setAuth(token: string, user: User){
    this.tokenSig.set(token); this.emailSig.set(user.email);
    localStorage.setItem('token', token); localStorage.setItem('email', user.email);
  }
  logout(){ this.tokenSig.set(null); this.emailSig.set(null); localStorage.removeItem('token'); localStorage.removeItem('email'); }
}
