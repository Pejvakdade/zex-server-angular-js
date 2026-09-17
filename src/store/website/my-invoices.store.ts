/** ---------------------------------------------------------------------------------------------------------------------
 * @file my-invoices.store.ts
 * @fileOverview the customer panel's My Invoices.
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';
import { Invoice } from '@src/store/admin/admin-invoices.store';

export type { Invoice, InvoiceStatus } from '@src/store/admin/admin-invoices.store';

type MyInvoicesState = { items: Array<Invoice>; loading: boolean; error: string | null };

export const MyInvoicesStore = signalStore(
  { providedIn: 'root' },
  withState<MyInvoicesState>({ items: [], loading: false, error: null }),
  withMethods((store, api = inject(ApiService)) => ({
    async load(): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const items = await firstValueFrom(api.get<Array<Invoice>>(apiRoutes.invoiceMe));
        patchState(store, { items, loading: false });
      } catch (error) {
        patchState(store, { loading: false, error: readError(error) });
      }
    },
  })),
);
