/** ---------------------------------------------------------------------------------------------------------------------
 * @file app.routes.ts
 * @fileOverview top-level split between the public website, the admin dashboard and the customer
 *               panel — the Angular equivalent of Miveh's `(website)` / `admin` route groups. Each
 *               side gets its own layout and its own lazily loaded child routes.
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('@src/features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: 'account',
    loadChildren: () => import('@src/features/client/client.routes').then((m) => m.clientRoutes),
  },
  {
    path: '',
    loadChildren: () => import('@src/features/website/website.routes').then((m) => m.websiteRoutes),
  },
];
