/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-overview.store.ts
 * @fileOverview the Overview cards' counters. A `null` metric has no data source yet and is
 *               rendered as a placeholder, never as a number — same rule as fleet-stats.store.
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';

export interface AdminOverview {
  customers: number | null;
  staff: number | null;
  plans: number | null;
  licenses: number | null;
  locations: number | null;
  activeServices: number | null;
  openTickets: number | null;
  revenue: number | null;
}

type OverviewState = {
  stats: AdminOverview | null;
  loading: boolean;
  error: string | null;
};

export const AdminOverviewStore = signalStore(
  { providedIn: 'root' },
  withState<OverviewState>({ stats: null, loading: false, error: null }),
  withMethods((store, api = inject(ApiService)) => ({
    async load(): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const stats = await firstValueFrom(api.get<AdminOverview>(apiRoutes.adminOverview));
        patchState(store, { stats, loading: false });
      } catch (error) {
        patchState(store, { loading: false, error: readError(error) });
      }
    },
  })),
);
