/** ---------------------------------------------------------------------------------------------------------------------
 * @file customers.ts
 * @fileOverview Customers: CLIENT accounts with the reference's REG.customers columns (Company,
 *               Contact email, Status, Customer since) and its CUSTOMER_FIELDS modal. The reference's
 *               `joined` text is the real createdAt here.
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

  protected openEdit(row: Row): void {
    const user = row.data as PublicUser;
    this.editing.set(user);
    this.draft.set({ fullName: user.fullName, company: user.company ?? '', status: user.status });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected async save(draft: Record<string, unknown>): Promise<void> {
    const editing = this.editing();
    if (!editing) return;
    if (await this.store.update(editing._id, draft as Partial<PublicUser>)) {
      this.modalOpen.set(false);
      this.toast.flash('Customer updated');
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
