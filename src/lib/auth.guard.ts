/** ---------------------------------------------------------------------------------------------------------------------
 * @file auth.guard.ts
 * @fileOverview route guards. `restore()` is awaited first so a hard reload does not bounce a signed-in
 *               user out before the token has been exchanged for a user record.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { AuthStore } from '@src/store/website/auth.store';

/** Any signed-in account. */
export const authGuard: CanActivateFn = async () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  await store.restore();

  return store.isAuthenticated() ? true : router.createUrlTree([appRoutes.Login]);
};

/** Admin or staff only — the guard behind every dashboard route. */
export const staffGuard: CanActivateFn = async () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  await store.restore();

  if (!store.isAuthenticated()) return router.createUrlTree([appRoutes.AdminLogin]);

  // A signed-in customer who wanders into /admin goes home, not to a login form they already passed.
  return store.isStaff() ? true : router.createUrlTree([appRoutes.Home]);
};

/** Keeps an already-signed-in user off the login and sign-up pages. */
export const guestGuard: CanActivateFn = async () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  await store.restore();

  if (!store.isAuthenticated()) return true;

  return router.createUrlTree([store.isStaff() ? appRoutes.AdminDashboard : appRoutes.Home]);
};
