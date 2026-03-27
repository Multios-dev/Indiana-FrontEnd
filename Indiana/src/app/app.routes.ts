import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { userGuard } from '../guards/user-guard.guard';
import { SCOUTS_ROUTES } from '../pages/scouts.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'connexion',
  },
  //lazy loading
  {
    path: '',
    loadChildren: () => import('../public/login.routes').then(m => m.LOGIN_ROUTES),
  },
  //Scouts routes
  {
    path: 'scouts',
    loadChildren: () => import('../pages/scouts.routes').then(m => m.SCOUTS_ROUTES),
    //Pour empêcher de pouvoir aller sur ces routes tant qu'on est pas connecté
    //canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'connexion',
  },
];
