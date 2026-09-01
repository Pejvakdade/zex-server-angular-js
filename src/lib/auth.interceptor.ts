/** ---------------------------------------------------------------------------------------------------------------------
 * @file auth.interceptor.ts
 * @fileOverview Angular counterpart of Miveh's FetchClient: prefixes relative URLs with the API root,
 *               attaches `Authorization: Bearer <jwt>` from the token cookie, and on a 401 clears auth
 *               cookies and redirects to the admin or website login depending on the current path.
 */
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import appRoutes from '@src/common/appRoutes';
import { environment } from '@src/environments/environment';
import { TOKEN_COOKIE, clearCookie, getCookie } from './cookie';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);

  const isAbsolute = /^https?:\/\//i.test(request.url);
  const token = getCookie(TOKEN_COOKIE);

  const outgoing = request.clone({
    url: isAbsolute ? request.url : `${environment.baseUrl}/${request.url.replace(/^\//, '')}`,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return next(outgoing).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        clearCookie(TOKEN_COOKIE);
        const inAdmin = router.url.startsWith('/admin');
        void router.navigateByUrl(inAdmin ? appRoutes.AdminLogin : appRoutes.Login);
      }
      return throwError(() => error);
    }),
  );
};
