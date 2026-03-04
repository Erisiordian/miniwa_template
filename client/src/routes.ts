import { Routes } from '@angular/router';
import { AuthGuard } from './app/core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'query', pathMatch: 'full' },
  { path: 'query', loadComponent: () => import('./app/pages/query/query.page').then(m => m.QueryPage) },
  { path: 'history', canActivate: [AuthGuard], loadComponent: () => import('./app/pages/history/history.page').then(m => m.HistoryPage) },
  { path: 'notebooks', canActivate: [AuthGuard], loadComponent: () => import('./app/pages/notebooks/notebooks.page').then(m => m.NotebooksPage) },
  { path: 'login', loadComponent: () => import('./app/pages/auth/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./app/pages/auth/register.page').then(m => m.RegisterPage) },
  { path: 'notebooks/:id', canActivate: [AuthGuard], loadComponent: () => import('./app/pages/notebook-editor/notebook-editor.page').then(m => m.NotebookEditorPage) },
  { path: '**', redirectTo: 'query' },
];
