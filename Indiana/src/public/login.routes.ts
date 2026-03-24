import { Routes } from '@angular/router';

export const LOGIN_ROUTES: Routes = [
  {
    path: 'connexion',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'inscription',
    loadComponent: () =>
      import('./register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'inscription/manuel',
    loadComponent: () =>
      import('./register/register-manual/register-manual.component').then(m => m.RegisterManualComponent),
  },
  {
    path: 'inscription/eid',
    loadComponent: () =>
      import('./register/register-eid/register-eid.component').then(m => m.RegisterEidComponent),
  },
  {
    path: 'mot-de-passe-oublie',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
];