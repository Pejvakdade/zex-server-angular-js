import { Routes } from '@angular/router';

import { AdminLayout } from './_component/admin-layout';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./overview/overview').then((m) => m.Overview) },
    ],
  },
];
