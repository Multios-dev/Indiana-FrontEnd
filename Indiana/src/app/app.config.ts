import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {provideTranslateService, provideTranslateLoader} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import { routes } from './app.routes';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptorInterceptor } from '../Interceptors/http.interceptor';
import { keycloakApiKeyInterceptor } from '../Interceptors/keycloak-api-key.interceptor';
import { MessageService } from 'primeng/api';
import { DATE_PIPE_DEFAULT_OPTIONS, DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([keycloakApiKeyInterceptor, httpInterceptorInterceptor])),
    provideBrowserGlobalErrorListeners(),
    importProvidersFrom(BrowserAnimationsModule),
    provideTranslateService({
      loader: provideTranslateHttpLoader({prefix:'assets/i18n/', suffix:'.json'}),
      fallbackLang: 'fr'
    }),
    MessageService,
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { dateFormat: 'dd-MM-yyyy' }
    },
  ],
};

