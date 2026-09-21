/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-overview.store.ts
 * @fileOverview the Overview cards' counters plus the "Recent activity" feed (GET /stats/activity),
 *               which the topbar bell reads too. A `null` metric has no data source yet and is
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

/** One row of the Overview table / bell dropdown — the backend's StatsNamespace.IActivityItem. */
export interface ActivityItem {
  id: string;
  kind: 'ticket' | 'invoice' | 'service' | 'customer';
  event: string;
  product: string | null;
  customer: string;
  at: string;
  needsAttention: boolean;
}

type OverviewState = {
  stats: AdminOverview | null;
  activity: Array<ActivityItem>;
  activityLoaded: boolean;
  loading: boolean;
  error: string | null;
};

export const AdminOverviewStore = signalStore(
  { providedIn: 'root' },
  withState<OverviewState>({ stats: null, activity: [], activityLoaded: false, loading: false, error: null }),
  withMethods((store, api = inject(ApiService)) => ({
    /** Newest first, already capped by the backend. Errors are swallowed: the feed is decoration, not data entry. */
    async loadActivity(): Promise<void> {
      try {
        const activity = await firstValueFrom(api.get<Array<ActivityItem>>(apiRoutes.adminActivity));
        patchState(store, { activity, activityLoaded: true });
      } catch {
        patchState(store, { activityLoaded: true });
      }
    },

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
