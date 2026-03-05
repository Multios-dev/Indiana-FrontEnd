import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const roles = auth.getRoles();
  const required = route.data['roles'] as string[] | undefined;
  if (!required || required.length === 0) {
    return true;
  }
  return required.some((r) => roles.includes(r));
};
