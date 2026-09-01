/** ---------------------------------------------------------------------------------------------------------------------
 * @file health.store.ts
 * @fileOverview reference NgRx SignalStore — the Angular counterpart of a Miveh Redux Toolkit slice.
 *               Keep website stores under store/website and admin stores under store/admin; don't mix
 *               the two domains in one store.
 */
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';

type HealthResult = { postgres: string; redis: string };

type HealthState = {
  status: HealthResult | null;
  loading: boolean;
  error: string | null;
};

const initialState: HealthState = { status: null, loading: false, error: null };

export const HealthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ status }) => ({
    isHealthy: computed(() => status()?.postgres === 'ok' && status()?.redis === 'ok'),
  })),
  withMethods((store, api = inject(ApiService)) => ({
    async load(): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const status = await firstValueFrom(api.get<HealthResult>(apiRoutes.health));
        patchState(store, { status, loading: false });
      } catch (error) {
        patchState(store, { error: (error as Error).message, loading: false });
      }
    },
  })),
);
