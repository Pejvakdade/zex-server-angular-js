/** ---------------------------------------------------------------------------------------------------------------------
 * @file plans.store.ts
 * @fileOverview pricing plans per product, keyed so several product sections can coexist on one page.
 */
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { Plan, PlanProduct } from '@src/shared/components/plan/plan.model';

type PlansState = {
  byProduct: Record<string, Array<Plan>>;
  loading: boolean;
};

export const PlansStore = signalStore(
  { providedIn: 'root' },
  withState<PlansState>({ byProduct: {}, loading: false }),
  withComputed(({ byProduct }) => ({
    /** Plans for one product; empty until that product has been loaded. */
    forProduct: computed(() => (product: PlanProduct) => byProduct()[product] ?? []),
  })),
  withMethods((store, api = inject(ApiService)) => ({
    async load(product: PlanProduct): Promise<void> {
      // Already fetched this product — the list is cached server-side anyway, no need to refetch.
      if (store.byProduct()[product]) return;

      patchState(store, { loading: true });
      try {
        const plans = await firstValueFrom(api.get<Array<Plan>>(apiRoutes.planByProduct(product)));
        patchState(store, {
          byProduct: { ...store.byProduct(), [product]: plans },
          loading: false,
        });
      } catch {
        // An empty list renders the grid's "no plans published" state rather than a broken page.
        patchState(store, { byProduct: { ...store.byProduct(), [product]: [] }, loading: false });
      }
    },
  })),
);
