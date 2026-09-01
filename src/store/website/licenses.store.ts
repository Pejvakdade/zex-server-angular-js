/** ---------------------------------------------------------------------------------------------------------------------
 * @file licenses.store.ts
 * @fileOverview the software licence catalogue, grouped by vendor category.
 */
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';

export interface License {
  _id: string;
  name: string;
  category: string;
  description: string;
  features: Array<string>;
  price: number;
  priceStr: string;
  installFee: number;
  installFeeStr: string;
}

export const LicensesStore = signalStore(
  { providedIn: 'root' },
  withState<{ licenses: Array<License>; loading: boolean; loaded: boolean }>({
    licenses: [],
    loading: false,
    loaded: false,
  }),
  withComputed(({ licenses }) => ({
    /** Preserves the API's order rather than sorting category names alphabetically. */
    byCategory: computed(() => {
      const groups: Array<{ category: string; items: Array<License> }> = [];
      for (const license of licenses()) {
        const group = groups.find((g) => g.category === license.category);
        if (group) group.items.push(license);
        else groups.push({ category: license.category, items: [license] });
      }
      return groups;
    }),
  })),
  withMethods((store, api = inject(ApiService)) => ({
    async load(): Promise<void> {
      if (store.loaded()) return;

      patchState(store, { loading: true });
      try {
        const licenses = await firstValueFrom(api.get<Array<License>>(apiRoutes.license));
        patchState(store, { licenses, loading: false, loaded: true });
      } catch {
        patchState(store, { licenses: [], loading: false, loaded: true });
      }
    },
  })),
);
