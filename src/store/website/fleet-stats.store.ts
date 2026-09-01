/** ---------------------------------------------------------------------------------------------------------------------
 * @file fleet-stats.store.ts
 * @fileOverview the public counters shown on marketing pages.
 *
 * @description
 *   Every metric is `number | null`, and **null means the backend has no data source for it yet** —
 *   not zero. Templates must render null through the `PLACEHOLDER` below rather than substituting a
 *   plausible figure: the reference design shipped invented numbers (42 servers, 99.9% uptime,
 *   3 tickets) and once a made-up number is on screen it is indistinguishable from a real one.
 *
 *   Nothing here needs to change as the backend fills metrics in — the moment
 *   GET stats/fleet returns a number instead of null, the UI shows it.
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';

/** Rendered wherever a metric has no data source yet. Deliberately not a number. */
export const PLACEHOLDER = '—';

export interface FleetStats {
  servers: number | null;
  uptime: number | null;
  tickets: number | null;
  locations: number | null;
}

type FleetStatsState = {
  stats: FleetStats;
  loading: boolean;
};

/** Starts as all-null, so a slow or failed request shows placeholders rather than invented data. */
const emptyStats: FleetStats = { servers: null, uptime: null, tickets: null, locations: null };

export const FleetStatsStore = signalStore(
  { providedIn: 'root' },
  withState<FleetStatsState>({ stats: emptyStats, loading: false }),
  withMethods((store, api = inject(ApiService)) => ({
    async load(): Promise<void> {
      patchState(store, { loading: true });
      try {
        const stats = await firstValueFrom(api.get<FleetStats>(apiRoutes.fleetStats));
        patchState(store, { stats, loading: false });
      } catch {
        // An unreachable API must not resurrect stale or fake figures — fall back to placeholders.
        patchState(store, { stats: emptyStats, loading: false });
      }
    },
  })),
);
