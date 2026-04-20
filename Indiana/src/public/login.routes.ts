import { Routes } from '@angular/router';
import { loggedGuard } from '../guards/logged.guard';

export const LOGIN_ROUTES: Routes = [
  {
    path: 'connexion',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [loggedGuard],
  },
  {
    path: 'inscription',
    loadComponent: () =>
      import('./register/register.component').then(m => m.RegisterComponent),
    canActivate: [loggedGuard],
  },
  {
    path: 'inscription/manuel',
    loadComponent: () =>
      import('./register/register-manual/register-manual.component').then(m => m.RegisterManualComponent),
    canActivate: [loggedGuard],
  },
  {
    path: 'inscription/eid',
    loadComponent: () =>
      import('./register/register-eid/register-eid.component').then(m => m.RegisterEidComponent),
    canActivate: [loggedGuard],
  },
  {
    path: 'mot-de-passe-oublie',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [loggedGuard],
  },
];