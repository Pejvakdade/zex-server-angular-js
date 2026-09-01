import { Routes } from '@angular/router';

import { guestGuard, staffGuard } from '@src/lib/auth.guard';
import { AdminLayout } from './_component/admin-layout';

export const adminRoutes: Routes = [
  /** The admin login sits outside AdminLayout — it must not render the dashboard shell. */
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('../website/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: AdminLayout,
    canActivate: [staffGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./overview/overview').then((m) => m.Overview) },
    ],
  },
];
