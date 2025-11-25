import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http'; // ✅ Correct import
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

registerLocaleData(localeFr);

bootstrapApplication(AppComponent, {
  providers: [
    // ✅ REPLACE this line:
    // importProvidersFrom(HttpClientModule),
    
    // ✅ WITH this line:
    provideHttpClient(withFetch()),
    
    provideAnimations(),
    provideRouter(routes),
    importProvidersFrom(
      CalendarModule.forRoot({ 
        provide: DateAdapter, 
        useFactory: adapterFactory 
      })
    ),
    { provide: LOCALE_ID, useValue: 'fr' }
  ],
}).catch((err: unknown) => console.error(err));