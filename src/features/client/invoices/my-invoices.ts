/** ---------------------------------------------------------------------------------------------------------------------
 * @file my-invoices.ts
 * @fileOverview My Invoices: the customer's billing history — read-only; payment is handled by staff
 *               marking an invoice paid (no payment gateway is scoped).
 */
import { Component, computed, inject } from '@angular/core';

import { UI, pill } from '@src/features/admin/_component/admin-ui';
import { invoiceTint, money } from '@src/features/admin/billing/billing';
import { MyInvoicesStore } from '@src/store/website/my-invoices.store';

@Component({
  selector: 'zx-my-invoices',
  templateUrl: './my-invoices.html',
})
export class MyInvoices {
  protected readonly store = inject(MyInvoicesStore);

  protected readonly ui = UI;
  protected readonly pill = pill;
  protected readonly tint = invoiceTint;
  protected readonly money = money;
  protected readonly columns = ['Invoice', 'Description', 'Amount', 'Status', 'Due', 'Paid'];

  protected readonly outstanding = computed(() =>
    this.store
      .items()
      .filter((invoice) => invoice.status !== 'Paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0),
  );

  constructor() {
    void this.store.load();
  }

  protected date(iso: string | null | undefined): string {
    return iso ? new Date(iso).toLocaleDateString() : '—';
  }
}
