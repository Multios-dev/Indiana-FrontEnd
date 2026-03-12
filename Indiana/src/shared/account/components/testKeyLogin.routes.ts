import { Routes } from '@angular/router';

export const TESTKEYLOGIN_ROUTES: Routes = [
  {
    path: 'Testconnexion',
    loadComponent: () =>
      import('./shared-login/shared-login.component').then(m => m.SharedLoginComponent),
  },
  {
    path: 'Testinscription',
    loadComponent: () =>
      import('./signup/signup.component').then(m => m.SignupComponent),
  }
];