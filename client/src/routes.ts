import { Routes } from '@angular/router';
import { authGuard } from './app/core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'query', pathMatch: 'full' },
  { path: 'query', loadComponent: () => import('./app/pages/query/query.page').then(m => m.QueryPage) },
  { path: 'history', canActivate: [authGuard], loadComponent: () => import('./app/pages/history/history.page').then(m => m.HistoryPage) },
  { path: 'notebooks', canActivate: [authGuard], loadComponent: () => import('./app/pages/notebooks/notebooks.page').then(m => m.NotebooksPage) },
  { path: 'login', loadComponent: () => import('./app/pages/auth/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./app/pages/auth/register.page').then(m => m.RegisterPage) },
  { path: '**', redirectTo: 'query' },
];
