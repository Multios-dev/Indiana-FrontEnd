import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { userGuard } from '../guards/user-guard.guard';
import { LOGIN_ROUTES } from '../public/login.routes';
import { TESTKEYLOGIN_ROUTES } from '../shared/account/components/testKeyLogin.routes';
import { SCOUTS_ROUTES } from '../pages/scouts.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'connexion',
  },
  //the routes for registration, login and forgot password are all in "login.routes.ts"
  //TODO Changer en lazy loading
  ...LOGIN_ROUTES,
  ...TESTKEYLOGIN_ROUTES,
  ...SCOUTS_ROUTES,
  {
    path: '**',
    redirectTo: 'connexion',
  },
];
