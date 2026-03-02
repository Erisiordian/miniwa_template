import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from '../../core/api';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './auth.page.css',
})
export class LoginPage{
  email=signal(''); password=signal('');
  loading=signal(false); error=signal<string|null>(null);
  constructor(private http: HttpClient, private auth: AuthService, private router: Router){}
  async submit(){
    this.error.set(null); this.loading.set(true);
    try{
      const res:any = await firstValueFrom(this.http.post(`${API_BASE}/auth/login`, { email: this.email(), password: this.password() }));
      this.auth.setAuth(res.token, res.user);
      this.router.navigateByUrl('/history');
    }catch(e:any){
      this.error.set(e?.error?.message || e?.message || 'Login failed');
    }finally{ this.loading.set(false); }
  }
}
