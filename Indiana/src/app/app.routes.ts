import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { userGuard } from '../guards/user-guard.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'connexion',
  },
  {
    path: 'connexion',
    loadComponent: () =>
      import('../public/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'inscription',
    loadComponent: () =>
      import('../public/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: "inscription/manuel",
    loadComponent: () =>
      import('../public/register/register-manual.component').then(m => m.RegisterManualComponent),
  },
  {
    path: '**',
    redirectTo: 'connexion',
  },
];
