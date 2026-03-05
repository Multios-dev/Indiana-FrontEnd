import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const payload = auth.getDecodedToken();
  if (!payload) {
    return false;
  }
  // If a :id param is provided, only allow access if it matches the token subject
  const id = route.paramMap.get('id') || route.params['id'];
  if (!id) {
    return true;
  }
  return id === payload.sub || id === payload.userId;
};
