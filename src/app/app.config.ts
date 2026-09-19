import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';

import { authInterceptor } from '@src/lib/auth.interceptor';
import { routes } from './app.routes';
import { SelectivePreload } from './preload.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      // Route params land on matching component inputs (the customer panel's ticket `:id`).
      withComponentInputBinding(),
      // Website chunks download right after first paint; see preload.strategy.ts.
      withPreloading(SelectivePreload),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
