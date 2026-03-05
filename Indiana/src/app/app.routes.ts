import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { userGuard } from '../guards/user-guard.guard';
import { LOGIN_ROUTES } from '../public/login.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'connexion',
  },
  //the routes for registration, login and forgot password are all in "login.routes.ts"
  ...LOGIN_ROUTES,
  {
    path: '**',
    redirectTo: 'connexion',
  },
];
