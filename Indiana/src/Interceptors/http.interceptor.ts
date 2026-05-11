import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../environment/environment';

/**
 * Interceptor HTTP centralisé pour gérer :
 * - Authentification Bearer pour les requêtes API normales
 * - API key pour les requêtes Keycloak
 */
export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  // Vérifier si c'est une requête Keycloak
  const isKeycloakRequest = req.url.includes(environment.baseKeyCloakUrl) || req.url.includes('/api/keycloak');

  if (isKeycloakRequest) {
    // Ajouter l'API key pour les requêtes Keycloak
    req = req.clone({
      setHeaders: {
        'x-api-key': environment.keycloakApiKey,
      },
    });
  } else {
    // Ajouter le Bearer token pour les autres requêtes
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