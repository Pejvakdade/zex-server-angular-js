/** ---------------------------------------------------------------------------------------------------------------------
 * @file overview.ts
 * @fileOverview the reference's OVERVIEW block: four KPI cards and a recent-activity table.
 *
 * @note The reference's cards read mock services/invoices/tickets and its activity rows were
 *       hard-coded. Here a metric with no table yet shows "—" (the store's null rule), and the
 *       table lists the newest contact-form messages — the one activity stream that is real today.
 */
import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { AdminOverviewStore } from '@src/store/admin/admin-overview.store';

import { UI, pill } from '../_component/admin-ui';

export const PLACEHOLDER = '—';

@Component({
  selector: 'zx-admin-overview',
  imports: [DatePipe, RouterLink],
  templateUrl: './overview.html',
})
export class Overview {
  protected readonly store = inject(AdminOverviewStore);
  protected readonly routes = appRoutes;
  protected readonly ui = UI;
  protected readonly pill = pill;
  protected readonly placeholder = PLACEHOLDER;

  constructor() {
    void this.store.load();
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
