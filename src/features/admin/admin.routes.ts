/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin.routes.ts
 * @fileOverview one child route per sidebar item. `data.section` carries the heading the layout
 *               renders (the reference's TITLES).
 */
import { Routes } from '@angular/router';

import { guestGuard, staffGuard } from '@src/lib/auth.guard';
import { AdminLayout } from './_component/admin-layout';
import { TITLES } from './_component/admin-nav';

const sitePage = () => import('./site/site-page').then((m) => m.SitePage);

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

      // Operations
      {
        path: 'overview',
        data: { section: TITLES.overview },
        loadComponent: () => import('./overview/overview').then((m) => m.Overview),
      },
      {
        path: 'customers',
        data: { section: TITLES.customers },
        loadComponent: () => import('./customers/customers').then((m) => m.Customers),
      },
      {
        path: 'services',
        data: { section: TITLES.services },
        loadComponent: () => import('./services/services').then((m) => m.Services),
      },
      {
        path: 'billing',
        data: { section: TITLES.billing },
        loadComponent: () => import('./billing/billing').then((m) => m.Billing),
      },
      {
        path: 'tickets',
        data: { section: TITLES.tickets },
        loadComponent: () => import('./tickets/tickets').then((m) => m.Tickets),
      },

      // Catalog
      {
        path: 'plans',
        data: { section: TITLES.plans },
        loadComponent: () => import('./plans/plans').then((m) => m.Plans),
      },
      {
        path: 'licenses',
        data: { section: TITLES.licenses },
        loadComponent: () => import('./licenses/licenses').then((m) => m.Licenses),
      },
      {
        path: 'locations',
        data: { section: TITLES.locations },
        loadComponent: () => import('./locations/locations').then((m) => m.Locations),
      },

      // Site content — one editor component, the page picked by `data.page`
      { path: 'site/home', data: { section: TITLES.home, page: 'home' }, loadComponent: sitePage },
      {
        path: 'site/about',
        data: { section: TITLES.about, page: 'about' },
        loadComponent: sitePage,
      },
      {
        path: 'site/contact',
        data: { section: TITLES.contact, page: 'contact' },
        loadComponent: sitePage,
      },
      {
        path: 'site/support',
        data: { section: TITLES.support, page: 'support' },
        loadComponent: sitePage,
      },
      {
        path: 'site/footer',
        data: { section: TITLES.footer, page: 'footer' },
        loadComponent: sitePage,
      },
      {
        path: 'site/legal',
        data: { section: TITLES.legal, page: 'legal' },
        loadComponent: sitePage,
      },
      {
        path: 'site/product-pages',
        data: { section: TITLES.productContent },
        loadComponent: () => import('./site/product-pages').then((m) => m.ProductPages),
      },

      // Admin
      {
        path: 'staff',
        data: { section: TITLES.staff },
        loadComponent: () => import('./staff/staff').then((m) => m.Staff),
      },
      {
        path: 'settings',
        data: { section: TITLES.settings },
        loadComponent: () => import('./settings/settings').then((m) => m.Settings),
      },
    ],
  },
];
