import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const loggedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  // Si l'utilisateur a un ID, il est connecté, rediriger vers le dashboard
  const userId = auth.getUserId();
  if (userId) {
    router.navigate(['/scouts/dashboard']);
    return false;
  }
  
  // Sinon, autoriser l'accès à la page de connexion
  return true;
};
