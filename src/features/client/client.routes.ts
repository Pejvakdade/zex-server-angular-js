/** ---------------------------------------------------------------------------------------------------------------------
 * @file client.routes.ts
 * @fileOverview the customer panel under /account — any signed-in account, own data only.
 */
import { Routes } from '@angular/router';

import { clientGuard } from '@src/lib/auth.guard';

import { ClientLayout } from './_component/client-layout';
import { CLIENT_TITLES } from './_component/client-nav';

export const clientRoutes: Routes = [
  {
    path: '',
    component: ClientLayout,
    canActivate: [clientGuard],
    children: [
      { path: '', redirectTo: 'services', pathMatch: 'full' },
      {
        path: 'services',
        data: { section: CLIENT_TITLES.services },
        loadComponent: () => import('./services/my-services').then((m) => m.MyServices),
      },
      {
        path: 'invoices',
        data: { section: CLIENT_TITLES.invoices },
        loadComponent: () => import('./invoices/my-invoices').then((m) => m.MyInvoices),
      },
      {
        path: 'tickets',
        data: { section: CLIENT_TITLES.tickets },
        loadComponent: () => import('./tickets/my-tickets').then((m) => m.MyTickets),
      },
      {
        path: 'tickets/:id',
        data: { section: CLIENT_TITLES.ticket },
        loadComponent: () => import('./tickets/ticket-detail').then((m) => m.TicketDetail),
      },
      {
        path: 'order/:planId',
        data: { section: CLIENT_TITLES.order },
        loadComponent: () => import('./order/order-confirm').then((m) => m.OrderConfirm),
      },
      {
        path: 'profile',
        data: { section: CLIENT_TITLES.profile },
        loadComponent: () => import('./profile/profile').then((m) => m.Profile),
      },
    ],
  },
];
