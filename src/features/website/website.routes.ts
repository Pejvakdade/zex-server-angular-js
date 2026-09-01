import { Routes } from '@angular/router';

import { WebsiteLayout } from './_component/website-layout';

export const websiteRoutes: Routes = [
  {
    path: '',
    component: WebsiteLayout,
    children: [
      { path: '', loadComponent: () => import('./home/home').then((m) => m.Home) },
    ],
  },
];
