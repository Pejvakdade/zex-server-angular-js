/** ---------------------------------------------------------------------------------------------------------------------
 * @file overview.ts
 * @fileOverview the reference's OVERVIEW block: four KPI cards and a recent-activity table.
 *
 * @note The reference's cards read mock services/invoices/tickets and its activity rows were
 *       hard-coded. Here the cards read the real tables (a metric with no source shows "—", the
 *       store's null rule), and the table is GET /stats/activity — the newest tickets, invoices,
 *       services and sign-ups merged into one feed, each row linking to its section.
 */
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { ActivityItem, AdminOverviewStore } from '@src/store/admin/admin-overview.store';
import { timeAgo } from '@src/shared/components/ticket/ticket.model';

import { UI, pill } from '../_component/admin-ui';

/** Where a row of the activity feed takes you. */
export const ACTIVITY_LINKS: Record<ActivityItem['kind'], string> = {
  ticket: appRoutes.AdminTickets,
  invoice: appRoutes.AdminBilling,
  service: appRoutes.AdminServices,
  customer: appRoutes.AdminCustomers,
};

export const PLACEHOLDER = '—';

@Component({
  selector: 'zx-admin-overview',
  imports: [RouterLink],
  templateUrl: './overview.html',
  styles: `
    .row:hover {
      background: var(--zx-row-hover);
    }
  `,
})
export class Overview {
  protected readonly store = inject(AdminOverviewStore);
  protected readonly routes = appRoutes;
  protected readonly ui = UI;
  protected readonly pill = pill;
  protected readonly placeholder = PLACEHOLDER;

  protected readonly activityLinks = ACTIVITY_LINKS;
  protected readonly timeAgo = timeAgo;

  constructor() {
    void this.store.load();
    void this.store.loadActivity();
  }

  protected metric(value: number | null | undefined): string {
    return value == null ? PLACEHOLDER : String(value);
  }

  protected money(value: number | null | undefined): string {
    return value == null
      ? PLACEHOLDER
      : '$' +
          value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
