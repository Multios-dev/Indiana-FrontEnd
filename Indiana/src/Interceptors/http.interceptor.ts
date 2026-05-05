import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../environment/environment';

export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  // Requêtes Keycloak : pas de Bearer (géré par keycloakApiKeyInterceptor)
  if (req.url.includes(environment.baseKeyCloakUrl)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const token = auth.getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};