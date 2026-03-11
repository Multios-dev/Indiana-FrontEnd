import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { SharedLoginComponent } from './components/shared-login/shared-login.component';

export const ACCOUNT_ROUTES: Routes = [
      {
        path: '', 
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path: 'login',
        component: SharedLoginComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      }
];
