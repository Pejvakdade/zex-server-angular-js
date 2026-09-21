/** ---------------------------------------------------------------------------------------------------------------------
 * @file order.store.ts
 * @fileOverview the confirm-order page: the plan being bought and the one call that buys it. There is
 *               no payment step yet — the API approves every order on the spot.
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';
import { Plan } from '@src/shared/components/plan/plan.model';
import { Invoice } from '@src/store/admin/admin-invoices.store';
import { Service } from '@src/store/admin/admin-services.store';
import { MyInvoicesStore } from './my-invoices.store';
import { MyServicesStore } from './my-services.store';

export type OrderResult = { service: Service; invoice: Invoice };

/** Optional add-ons that ride along with the plan. */
export type OrderOptions = { licenseId?: string; installLicense?: boolean };

type OrderState = {
  plan: Plan | null;
  loading: boolean;
  placing: boolean;
  error: string | null;
  result: OrderResult | null;
};

export const OrderStore = signalStore(
  { providedIn: 'root' },
  withState<OrderState>({ plan: null, loading: false, placing: false, error: null, result: null }),
  withMethods(
    (
      store,
      api = inject(ApiService),
      services = inject(MyServicesStore),
      invoices = inject(MyInvoicesStore),
    ) => ({
      async loadPlan(planId: string): Promise<void> {
        patchState(store, { plan: null, result: null, loading: true, error: null });
        try {
          const plan = await firstValueFrom(api.get<Plan>(apiRoutes.planById(planId)));
          patchState(store, { plan, loading: false });
        } catch (error) {
          patchState(store, { loading: false, error: readError(error) });
        }
      },

      async place(planId: string, options: OrderOptions = {}): Promise<OrderResult | null> {
        patchState(store, { placing: true, error: null });
        try {
          const result = await firstValueFrom(
            api.post<OrderResult>(apiRoutes.order, { planId, ...options }),
          );
          patchState(store, { result, placing: false });
          // The panel lists are cached per session — refresh so the new rows show up right away.
          void Promise.all([services.load(), invoices.load()]);
          return result;
        } catch (error) {
          patchState(store, { placing: false, error: readError(error) });
          return null;
        }
      },
    }),
  ),
);
