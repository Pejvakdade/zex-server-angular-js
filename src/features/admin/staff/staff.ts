/** ---------------------------------------------------------------------------------------------------------------------
 * @file staff.ts
 * @fileOverview Staff & Users: console accounts (admin + staff) with the reference's REG.staff
 *               columns and STAFF_FIELDS modal. The reference's four roles collapse onto the two the
 *               backend has (admin / staff); the signed-in admin's own row cannot be deleted.
 */
import { Component, computed, inject, signal } from '@angular/core';

import { AdminToastStore } from '@src/store/admin/admin-toast.store';
import { AdminUsersStore } from '@src/store/admin/admin-users.store';
import { AuthStore, PublicUser, UserType } from '@src/store/website/auth.store';

import { ConfirmDialog } from '../_component/confirm-dialog';
import { DataTable } from '../_component/data-table';
import { EntityModal } from '../_component/entity-modal';
import { FieldDef, Row, UI } from '../_component/admin-ui';

const ROLES: ReadonlyArray<UserType> = ['admin', 'staff'];

const ADD_FIELDS: Array<FieldDef> = [
  { key: 'fullName', label: 'Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'text', required: true },
  { key: 'password', label: 'Password (min 8 characters)', type: 'text', required: true },
  { key: 'userType', label: 'Role', type: 'select', options: ROLES },
];

const EDIT_FIELDS: Array<FieldDef> = [
  { key: 'fullName', label: 'Name', type: 'text', required: true },
  { key: 'userType', label: 'Role', type: 'select', options: ROLES },
  { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Suspended'] },
];

@Component({
  selector: 'zx-admin-staff',
  imports: [DataTable, EntityModal, ConfirmDialog],
  templateUrl: './staff.html',
})
export class Staff {
  protected readonly store = inject(AdminUsersStore);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(AdminToastStore);

  protected readonly ui = UI;
  protected readonly columns = ['Name', 'Email', 'Role', 'Status'];

  protected readonly rows = computed<Array<Row<PublicUser>>>(() =>
    this.store.page().docs.map((user) => ({
      id: user._id,
      label: user.fullName,
      data: user,
      noDelete: user._id === this.auth.user()?._id,
      cells: [
        { text: user.fullName },
        { text: user.email },
        { text: user.userType === 'admin' ? 'Admin' : 'Staff', tint: 'blue' },
        { text: user.status, tint: user.status === 'Active' ? 'green' : 'neutral' },
      ],
    })),
  );

  protected readonly editing = signal<PublicUser | null>(null);
  protected readonly modalOpen = signal(false);
  protected readonly draft = signal<Record<string, unknown>>({});
  protected readonly deleting = signal<Row<PublicUser> | null>(null);

  protected readonly fields = computed(() => (this.editing() ? EDIT_FIELDS : ADD_FIELDS));

  constructor() {
    this.store.setScope('admin,staff');
    void this.store.load();
  }

  protected openAdd(): void {
    this.editing.set(null);
    this.draft.set({ fullName: '', email: '', password: '', userType: 'staff' });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected openEdit(row: Row): void {
    const user = row.data as PublicUser;
    this.editing.set(user);
    this.draft.set({ fullName: user.fullName, userType: user.userType, status: user.status });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected async save(draft: Record<string, unknown>): Promise<void> {
    const editing = this.editing();
    const ok = editing
      ? await this.store.update(editing._id, draft as Partial<PublicUser>)
      : await this.store.createStaff(
          draft as { fullName: string; email: string; password: string; userType: UserType },
        );

    if (ok) {
      this.modalOpen.set(false);
      this.toast.flash(editing ? 'Account updated' : 'Staff member added');
    }
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleting();
    if (!row) return;
    if (await this.store.remove(row.id)) {
      this.deleting.set(null);
      this.toast.flash('Account deleted');
    }
  }
}
