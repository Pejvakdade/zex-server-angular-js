import { Routes } from '@angular/router';

import { guestGuard } from '@src/lib/auth.guard';
import { WebsiteLayout } from './_component/website-layout';

export const websiteRoutes: Routes = [
  {
    path: '',
    component: WebsiteLayout,
    children: [
      { path: '', loadComponent: () => import('./home/home').then((m) => m.Home) },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./auth/login/login').then((m) => m.Login),
      },
      {
        path: 'get-started',
        canActivate: [guestGuard],
        loadComponent: () => import('./auth/get-started/get-started').then((m) => m.GetStarted),
      },
    ],
  },
];
