import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  sidebarOpen = signal(false);
  isAuthed = computed(() => this.auth.isLoggedIn());
  constructor(public auth: AuthService) {}
  toggleSidebar(){ this.sidebarOpen.update(v=>!v); }
  logout(){ this.auth.clear(); }
}
