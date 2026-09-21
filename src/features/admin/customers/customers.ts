/** ---------------------------------------------------------------------------------------------------------------------
 * @file customers.ts
 * @fileOverview Customers: CLIENT accounts with the reference's REG.customers columns (Company,
 *               Contact email, Status, Customer since) and its CUSTOMER_FIELDS modal. The reference's
 *               `joined` text is the real createdAt here, so "+ Add Customer" asks for a temporary
 *               password instead of a "customer since" date (POST /user/customer).
 */
import { Component, computed, inject, signal } from '@angular/core';

import { AdminToastStore } from '@src/store/admin/admin-toast.store';
import { AdminUsersStore, UserStatus } from '@src/store/admin/admin-users.store';
import { PublicUser } from '@src/store/website/auth.store';

import { ConfirmDialog } from '../_component/confirm-dialog';
import { DataTable } from '../_component/data-table';
import { EntityModal } from '../_component/entity-modal';
import { FieldDef, Row, UI } from '../_component/admin-ui';

const STATUSES: ReadonlyArray<UserStatus> = ['Active', 'Suspended'];

const FIELDS: Array<FieldDef> = [
  { key: 'fullName', label: 'Name', type: 'text', required: true },
  { key: 'company', label: 'Company', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: STATUSES },
];

/** "+ Add Customer": the reference's Company / Contact email / Status, plus the sign-in details. */
const CREATE_FIELDS: Array<FieldDef> = [
  { key: 'company', label: 'Company', type: 'text', required: true },
  { key: 'fullName', label: 'Contact name (blank = company)', type: 'text' },
  { key: 'email', label: 'Contact email', type: 'text', required: true },
  { key: 'password', label: 'Temporary password (min 8 characters)', type: 'text', required: true },
  { key: 'status', label: 'Status', type: 'select', options: STATUSES },
];

@Component({
  selector: 'zx-admin-customers',
  imports: [DataTable, EntityModal, ConfirmDialog],
  templateUrl: './customers.html',
})
export class Customers {
  protected readonly store = inject(AdminUsersStore);
  private readonly toast = inject(AdminToastStore);

  protected readonly ui = UI;
  protected readonly fields = FIELDS;
  protected readonly createFields = CREATE_FIELDS;
  protected readonly statuses = STATUSES;
  protected readonly columns = ['Customer', 'Company', 'Contact email', 'Status', 'Customer since'];

  protected readonly rows = computed<Array<Row<PublicUser>>>(() =>
    this.store.page().docs.map((user) => ({
      id: user._id,
      label: user.fullName,
      data: user,
      cells: [
        { text: user.fullName },
        { text: user.company || '—' },
        { text: user.email },
        { text: user.status, tint: user.status === 'Active' ? 'green' : 'red' },
        { text: new Date((user as any).createdAt).toLocaleDateString() },
      ],
    })),
  );

  protected readonly editing = signal<PublicUser | null>(null);
  protected readonly modalOpen = signal(false);
  protected readonly draft = signal<Record<string, unknown>>({});
  protected readonly deleting = signal<Row<PublicUser> | null>(null);

  constructor() {
    this.store.setScope('client');
    void this.store.load();
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.draft.set({ company: '', fullName: '', email: '', password: '', status: 'Active' });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected openEdit(row: Row): void {
    const user = row.data as PublicUser;
    this.editing.set(user);
    this.draft.set({ fullName: user.fullName, company: user.company ?? '', status: user.status });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected async save(draft: Record<string, unknown>): Promise<void> {
    const editing = this.editing();
    const ok = editing
      ? await this.store.update(editing._id, draft as Partial<PublicUser>)
      : await this.store.createCustomer({
          ...(draft as { company: string; email: string; password: string; status: UserStatus }),
          fullName: (draft['fullName'] as string) || undefined,
        });
    if (ok) {
      this.modalOpen.set(false);
      this.toast.flash(editing ? 'Customer updated' : 'Customer added');
    }
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleting();
    if (!row) return;
    if (await this.store.remove(row.id)) {
      this.deleting.set(null);
      this.toast.flash('Customer deleted');
    }
  }

  protected setStatus(status: UserStatus | null): void {
    this.store.setStatus(status);
    void this.store.load();
  }

  protected onSearch(event: Event): void {
    this.store.setSearch((event.target as HTMLInputElement).value);
    void this.store.load();
  }

  protected goTo(page: number): void {
    void this.store.load(page);
  }
}
