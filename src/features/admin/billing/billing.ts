/** ---------------------------------------------------------------------------------------------------------------------
 * @file billing.ts
 * @fileOverview Admin → Billing: the reference's REG.billing table (Invoice, Customer, Amount, Status,
 *               Date) and INVOICE_FIELDS modal over the real `invoice` table, plus a per-row
 *               "Mark paid" that the reference did not have but the revenue counter needs.
 */
import { Component, computed, inject, signal } from '@angular/core';

import { AdminInvoicesStore, Invoice, InvoiceStatus } from '@src/store/admin/admin-invoices.store';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';

import { ConfirmDialog } from '../_component/confirm-dialog';
import { CustomerOptions, customerLabel } from '../_component/customer-options';
import { DataTable } from '../_component/data-table';
import { EntityModal } from '../_component/entity-modal';
import { FieldDef, Row, Tint, UI } from '../_component/admin-ui';
import { Pager } from '../_component/pager';

const STATUSES: ReadonlyArray<InvoiceStatus> = ['Paid', 'Pending', 'Overdue'];

/** The reference's invoiceTagStyle: green paid, red overdue, amber otherwise. */
export const invoiceTint = (status: InvoiceStatus): Tint =>
  status === 'Paid' ? 'green' : status === 'Overdue' ? 'red' : 'amber';

export const money = (value: number): string =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

@Component({
  selector: 'zx-admin-billing',
  imports: [DataTable, EntityModal, ConfirmDialog, Pager],
  templateUrl: './billing.html',
})
export class Billing {
  protected readonly store = inject(AdminInvoicesStore);
  private readonly customers = inject(CustomerOptions);
  private readonly toast = inject(AdminToastStore);

  protected readonly ui = UI;
  protected readonly statuses = STATUSES;
  protected readonly columns = ['Invoice', 'Customer', 'Description', 'Amount', 'Status', 'Due'];

  protected readonly fields = computed<Array<FieldDef>>(() => [
    { key: 'number', label: 'Invoice # (blank = next number)', type: 'text' },
    { key: 'customerId', label: 'Customer', type: 'select', options: this.customers.options() },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'amount', label: 'Amount ($)', type: 'number', required: true },
    { key: 'status', label: 'Status', type: 'select', options: STATUSES },
    { key: 'dueAt', label: 'Due date', type: 'date', required: true },
  ]);

  protected readonly rows = computed<Array<Row<Invoice>>>(() =>
    this.store.page().docs.map((invoice) => ({
      id: invoice._id,
      label: invoice.number,
      data: invoice,
      noAction: invoice.status === 'Paid',
      cells: [
        { text: invoice.number },
        { text: customerLabel(invoice.customer) },
        { text: invoice.description || '—' },
        { text: money(invoice.amount) },
        { text: invoice.status, tint: invoiceTint(invoice.status) },
        { text: new Date(invoice.dueAt).toLocaleDateString() },
      ],
    })),
  );

  protected readonly editing = signal<Invoice | null>(null);
  protected readonly modalOpen = signal(false);
  protected readonly draft = signal<Record<string, unknown>>({});
  protected readonly deleting = signal<Row<Invoice> | null>(null);

  constructor() {
    void this.store.load();
    void this.customers.load();
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.draft.set({
      number: '',
      customerId: '',
      description: '',
      amount: null,
      status: 'Pending',
      dueAt: '',
    });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected openEdit(row: Row): void {
    const invoice = row.data as Invoice;
    this.editing.set(invoice);
    this.draft.set({
      number: invoice.number,
      customerId: invoice.customerId,
      description: invoice.description,
      amount: invoice.amount,
      status: invoice.status,
      dueAt: invoice.dueAt,
    });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected async save(draft: Record<string, unknown>): Promise<void> {
    // An empty number means "assign the next one" — the DTO rejects '' but accepts absence.
    const body = { ...draft } as Partial<Invoice>;
    if (!body.number) delete body.number;

    const editing = this.editing();
    const ok = editing ? await this.store.update(editing._id, body) : await this.store.create(body);
    if (ok) {
      this.modalOpen.set(false);
      this.toast.flash(editing ? 'Invoice updated' : 'Invoice issued');
    }
  }

  protected async markPaid(row: Row): Promise<void> {
    if (await this.store.markPaid(row.id)) this.toast.flash(`${row.label} marked paid`);
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleting();
    if (!row) return;
    if (await this.store.remove(row.id)) {
      this.deleting.set(null);
      this.toast.flash('Invoice deleted');
    }
  }

  protected setStatus(status: InvoiceStatus | null): void {
    this.store.setFilter('status', status);
    void this.store.load();
  }

  protected onSearch(event: Event): void {
    this.store.setFilter('search', (event.target as HTMLInputElement).value);
    void this.store.load();
  }

  protected goTo(page: number): void {
    void this.store.load(page);
  }
}
