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

const routes: Routes = [
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
        path: 'software-licenses',
        loadComponent: () => import('./licenses/licenses').then((m) => m.Licenses),
      },
      {
        path: 'support',
        loadComponent: () => import('./support/support').then((m) => m.Support),
      },
      {
        path: 'locations',
        loadComponent: () => import('./locations/locations').then((m) => m.Locations),
      },
      {
        path: 'blog',
        loadComponent: () => import('./blog/blog').then((m) => m.Blog),
      },
      {
        path: 'blog/:slug',
        loadComponent: () => import('./blog/blog-post').then((m) => m.BlogPostPage),
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

/**
 * Every public page is preloaded (see app/preload.strategy.ts), so a visitor who lands on the home
 * page already has the product / licenses chunks by the time they click a nav link.
 */
export const websiteRoutes: Routes = routes.map((route) => ({
  ...route,
  children: route.children?.map((child) => ({
    ...child,
    data: { ...child.data, preload: true },
  })),
}));
