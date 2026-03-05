import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const loggedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  // redirect to auth area if already logged in
  return !auth.isLoggedIn();
};
