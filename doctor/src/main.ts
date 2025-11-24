import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';           // ✅ add this
import { routes } from './app/app.routes';                 // ✅ add this
import { AppComponent } from './app/app.component';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


registerLocaleData(localeFr);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })), 
    provideAnimations(),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'fr' }                                 // ✅ add this
  ],
}).catch((err: unknown) => console.error(err));
