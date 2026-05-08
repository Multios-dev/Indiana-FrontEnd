import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environment/environment';

//TODO déplacer logique de cet interceptor dans l'autre afin de centraliser et éviter de devoir vérifier dans plusieurs
//interceptors si la requete est pour keycloak ou pas

export const keycloakApiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  // Add the API key to requests to Keycloak (direct or via proxy)
  if (req.url.includes('/api/keycloak') || req.url.includes(environment.baseKeyCloakUrl)) {
    req = req.clone({
      setHeaders: {
        'x-api-key': environment.keycloakApiKey,
      },
    });
  }
  return next(req);
};
