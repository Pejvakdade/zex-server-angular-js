/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-plans.store.ts
 * @fileOverview every pricing plan (inactive included) plus the Pricing Plans table's filters — the
 *               reference kept `plansFilter` / `plansLocationFilter` / `plansSearch` in component
 *               state; they live here so the table survives navigating away and back.
 */
import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import apiRoutes from '@src/common/apiRoutes';
import { withCrud } from './_crud.feature';

export interface AdminPlan {
  _id: string;
  product: string;
  name: string;
  tagline: string;
  price: number;
  priceStr: string;
  popular: boolean;
  location: string;
  specs: Record<string, string | undefined>;
  featureList: Array<string>;
  isActive: boolean;
  sortOrder: number;
}

export const ALL_PRODUCTS = 'All';
export const ALL_LOCATIONS = 'All locations';

export const AdminPlansStore = signalStore(
  { providedIn: 'root' },
  withCrud<AdminPlan>({
    list: apiRoutes.planAdminAll,
    create: apiRoutes.plan,
    byId: apiRoutes.planById,
  }),
  withState({ product: ALL_PRODUCTS, location: ALL_LOCATIONS, search: '' }),
  withComputed(({ items, product, location, search }) => ({
    filtered: computed(() => {
      const query = search().trim().toLowerCase();
      return items().filter(
        (plan) =>
          (product() === ALL_PRODUCTS || plan.product === product()) &&
          (location() === ALL_LOCATIONS || plan.location === location()) &&
          (!query || plan.name.toLowerCase().includes(query)),
      );
    }),
  })),
  withMethods((store) => ({
    setProduct: (product: string) => patchState(store, { product }),
    setLocation: (location: string) => patchState(store, { location }),
    setSearch: (search: string) => patchState(store, { search }),
  })),
);
