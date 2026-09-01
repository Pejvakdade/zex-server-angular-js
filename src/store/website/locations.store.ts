/** ---------------------------------------------------------------------------------------------------------------------
 * @file locations.store.ts
 * @fileOverview the datacenter locations, as returned by the location API.
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';

export interface Location {
  _id: string;
  city: string;
  country: string;
  flag: string;
  datacenter: string;
  network: string;
  latencyLabel: string;
  latencyValue: string;
  products: Array<string>;
  description: string;
  /** null for sites whose coordinates the reference never provided. */
  latitude: number | null;
  longitude: number | null;
}

export const LocationsStore = signalStore(
  { providedIn: 'root' },
  withState<{ locations: Array<Location>; loading: boolean; loaded: boolean }>({
    locations: [],
    loading: false,
    loaded: false,
  }),
  withMethods((store, api = inject(ApiService)) => ({
    async load(): Promise<void> {
      if (store.loaded()) return;

      patchState(store, { loading: true });
      try {
        const locations = await firstValueFrom(api.get<Array<Location>>(apiRoutes.location));
        patchState(store, { locations, loading: false, loaded: true });
      } catch {
        patchState(store, { locations: [], loading: false, loaded: true });
      }
    },
  })),
);
