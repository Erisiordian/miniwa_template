import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from '../../core/api';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './auth.page.css',
})
export class RegisterPage{
  email=signal(''); password=signal('');
  loading=signal(false); error=signal<string|null>(null); ok=signal<string|null>(null);
  constructor(private http: HttpClient, private router: Router){}
  async submit(){
    this.error.set(null); this.ok.set(null); this.loading.set(true);
    try{
      await firstValueFrom(this.http.post(`${API_BASE}/auth/register`, { email: this.email(), password: this.password() }));
      this.ok.set('Account created. You can login now.');
      setTimeout(()=>this.router.navigateByUrl('/login'), 600);
    }catch(e:any){
      this.error.set(e?.error?.message || e?.message || 'Register failed');
    }finally{ this.loading.set(false); }
  }
}
