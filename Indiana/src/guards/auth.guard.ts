import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  // Vérifier si l'utilisateur a un ID (connecté)
  const userId = auth.getUserId();
  if (userId) {
    return true;
  }
  
  // Rediriger vers login
  router.navigate(['/login']);
  return false;
};
