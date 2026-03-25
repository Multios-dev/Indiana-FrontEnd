import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {provideTranslateService, provideTranslateLoader} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import { routes } from './app.routes';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptorInterceptor } from '../Interceptors/http.interceptor';
import { MessageService } from 'primeng/api';
import { DATE_PIPE_DEFAULT_OPTIONS, DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpInterceptorInterceptor])),
    provideBrowserGlobalErrorListeners(),
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(),
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

