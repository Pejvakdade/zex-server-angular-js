/** ---------------------------------------------------------------------------------------------------------------------
 * @file my-services.store.ts
 * @fileOverview the customer panel's My Services: everything the signed-in account owns.
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';
import { Service } from '@src/store/admin/admin-services.store';

export type { Service, ServiceStatus } from '@src/store/admin/admin-services.store';

type MyServicesState = { items: Array<Service>; loading: boolean; error: string | null };

export const MyServicesStore = signalStore(
  { providedIn: 'root' },
  withState<MyServicesState>({ items: [], loading: false, error: null }),
  withMethods((store, api = inject(ApiService)) => ({
    async load(): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const items = await firstValueFrom(api.get<Array<Service>>(apiRoutes.serviceMe));
        patchState(store, { items, loading: false });
      } catch (error) {
        patchState(store, { loading: false, error: readError(error) });
      }
    },
  })),
);
