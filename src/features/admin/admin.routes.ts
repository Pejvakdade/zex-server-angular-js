/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin.routes.ts
 * @fileOverview one child route per sidebar item. `data.section` carries the heading the layout
 *               renders (the reference's TITLES); `data.note` is the placeholder text for sections
 *               that are not built yet.
 */
import { Routes } from '@angular/router';

import { guestGuard, staffGuard } from '@src/lib/auth.guard';
import { AdminLayout } from './_component/admin-layout';
import { TITLES } from './_component/admin-nav';

const PHASE_6 = 'Arrives with phase 6, once the service, invoice and ticket tables exist.';
const SLICE_B = 'The Site Content editors arrive in the next slice of phase 5.';

const placeholder = () =>
  import('./_component/section-placeholder').then((m) => m.SectionPlaceholder);

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
        path: 'billing',
        data: { section: TITLES.billing, note: PHASE_6 },
        loadComponent: placeholder,
      },
      {
        path: 'tickets',
        data: { section: TITLES.tickets, note: PHASE_6 },
        loadComponent: placeholder,
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

      // Site content — next slice
      {
        path: 'site/home',
        data: { section: TITLES.home, note: SLICE_B },
        loadComponent: placeholder,
      },
      {
        path: 'site/about',
        data: { section: TITLES.about, note: SLICE_B },
        loadComponent: placeholder,
      },
      {
        path: 'site/contact',
        data: { section: TITLES.contact, note: SLICE_B },
        loadComponent: placeholder,
      },
      {
        path: 'site/support',
        data: { section: TITLES.support, note: SLICE_B },
        loadComponent: placeholder,
      },
      {
        path: 'site/footer',
        data: { section: TITLES.footer, note: SLICE_B },
        loadComponent: placeholder,
      },
      {
        path: 'site/legal',
        data: { section: TITLES.legal, note: SLICE_B },
        loadComponent: placeholder,
      },
      {
        path: 'site/product-pages',
        data: { section: TITLES.productContent, note: SLICE_B },
        loadComponent: placeholder,
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
