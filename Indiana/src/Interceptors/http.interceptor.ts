import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../environment/environment';

export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  // Ne pas ajouter le token Bearer aux requêtes Keycloak (qui utilisent x-api-key)
  if (req.url.includes('/api/keycloak') || req.url.includes(environment.baseKeyCloakUrl)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const token = auth.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};
