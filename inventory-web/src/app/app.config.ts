import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { provideTranslateService, TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(ReactiveFormsModule),
    provideHttpClient(),
    importProvidersFrom(TranslateModule.forRoot()),
    provideTranslateService({
      defaultLanguage: 'pt'
    }),

    /*
    Registers the pt-BR locale so that Angular knows how to format dates, numbers, etc.
    Where in this case for columns of quantity, price, etc. it comes in the national standard and not in the American
    for the number pipe that used to come 1,000 (American standard), now it will appear 1.000 (Brazilian standard)
    */
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    }),
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
