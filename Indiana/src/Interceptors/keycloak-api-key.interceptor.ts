import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environment/environment';

export const keycloakApiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  // Ajouter la clé API aux requêtes vers Keycloak (direct ou via proxy)
  if (req.url.includes('/api/keycloak') || req.url.includes(environment.baseKeyCloakUrl)) {
    console.log('🔑 Ajout x-api-key pour:', req.url);
    req = req.clone({
      setHeaders: {
        'x-api-key': environment.keycloakApiKey,
      },
    });
  }
  return next(req);
};
