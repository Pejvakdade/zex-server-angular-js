import { Routes } from '@angular/router';

import { guestGuard } from '@src/lib/auth.guard';
import { PlanProduct } from '@src/shared/components/plan/plan.model';
import { WebsiteLayout } from './_component/website-layout';

/**
 * All six product pages are the same component with different data. The path segments match
 * appRoutes, and the product strings match the backend's PlanNamespace.EPlanProduct exactly - a
 * mismatch here returns an empty plan list rather than an error, so keep them in step.
 */
const PRODUCT_PAGES: Array<{ path: string; product: PlanProduct }> = [
  { path: 'vps-hosting', product: 'VPS Hosting' },
  { path: 'windows-vps', product: 'Windows VPS' },
  { path: 'trading-vps', product: 'Trading VPS' },
  { path: 'dedicated-servers', product: 'Dedicated Servers' },
  { path: 'web-hosting', product: 'Web Hosting' },
  { path: 'wordpress-hosting', product: 'WordPress Hosting' },
];

export const websiteRoutes: Routes = [
  {
    path: '',
    component: WebsiteLayout,
    children: [
      { path: '', loadComponent: () => import('./home/home').then((m) => m.Home) },
      ...PRODUCT_PAGES.map(({ path, product }) => ({
        path,
        data: { product },
        loadComponent: () => import('./product/product').then((m) => m.Product),
      })),
      {
        path: 'about-us',
        loadComponent: () => import('./about/about').then((m) => m.About),
      },
      {
        path: 'contact-us',
        loadComponent: () => import('./contact/contact').then((m) => m.Contact),
      },
      {
        path: 'locations',
        loadComponent: () => import('./locations/locations').then((m) => m.Locations),
      },
      {
        path: 'terms-of-service',
        data: { document: 'terms' },
        loadComponent: () => import('./legal/legal').then((m) => m.Legal),
      },
      {
        path: 'privacy-policy',
        data: { document: 'privacy' },
        loadComponent: () => import('./legal/legal').then((m) => m.Legal),
      },
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
