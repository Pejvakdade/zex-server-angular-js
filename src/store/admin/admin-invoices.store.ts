/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-invoices.store.ts
 * @fileOverview Admin → Billing: every invoice with its customer, plus mark-paid.
 */
import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { PublicUser } from '@src/store/website/auth.store';

import { withPaged } from './_paged.feature';

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Invoice {
  _id: string;
  number: string;
  customerId: string;
  customer?: PublicUser;
  serviceId?: string | null;
  amount: number;
  status: InvoiceStatus;
  /** yyyy-mm-dd. */
  dueAt: string;
  paidAt?: string | null;
  description: string;
  createdAt: string;
}

export type InvoiceFilters = {
  status: string | null;
  customerId: string | null;
  search: string | null;
};

export const AdminInvoicesStore = signalStore(
  { providedIn: 'root' },
  withPaged<Invoice, InvoiceFilters>(apiRoutes.invoice, {
    status: null,
    customerId: null,
    search: null,
  }),
  withMethods((store, api = inject(ApiService)) => ({
    create: (body: Partial<Invoice>) =>
      store.write(() => firstValueFrom(api.post(apiRoutes.invoice, body))),
    update: (id: string, body: Partial<Invoice>) =>
      store.write(() => firstValueFrom(api.patch(apiRoutes.invoiceById(id), body))),
    markPaid: (id: string) =>
      store.write(() => firstValueFrom(api.patch(apiRoutes.invoicePay(id), {}))),
    remove: (id: string) =>
      store.write(() => firstValueFrom(api.delete(apiRoutes.invoiceById(id)))),
  })),
);
