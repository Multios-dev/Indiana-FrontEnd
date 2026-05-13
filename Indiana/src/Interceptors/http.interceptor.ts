import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../environment/environment';

/**
 * Interceptor HTTP centralised to manage :
 * - Authentification Bearer for normal API requests
 * - API key for Keycloak requests
 */
export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  // Verify if it's a Keycloak request
  const isKeycloakRequest = req.url.includes(environment.baseKeyCloakUrl) || req.url.includes('/api/keycloak');

  if (isKeycloakRequest) {
    // Add the API key for Keycloak requests
    req = req.clone({
      setHeaders: {
        'x-api-key': environment.keycloakApiKey,
      },
    });
  } else {
    // Add the Bearer token for other requests
    const auth = inject(AuthService);
    const token = auth.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
  }

  return next(req);
};