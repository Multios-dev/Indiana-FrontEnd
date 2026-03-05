import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { routes } from './app.routes';
import { httpInterceptorInterceptor } from '../Interceptors/http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([httpInterceptorInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
   
  ],
};
