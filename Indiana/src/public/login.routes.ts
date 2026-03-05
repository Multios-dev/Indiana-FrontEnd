import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { loggedGuard } from '../guards/logged.guard';

export const LOGIN_ROUTES: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [loggedGuard],
  },
];
