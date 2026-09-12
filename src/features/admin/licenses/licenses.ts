/** ---------------------------------------------------------------------------------------------------------------------
 * @file licenses.ts
 * @fileOverview Software Licenses: the REG.licenses table and the LICENSE_FIELDS modal. The reference
 *               edits features as three text boxes; that is kept, with the array split/joined here.
 */
import { Component, computed, inject, signal } from '@angular/core';

import { AdminLicense, AdminLicensesStore } from '@src/store/admin/admin-licenses.store';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';

import { ConfirmDialog } from '../_component/confirm-dialog';
import { DataTable } from '../_component/data-table';
import { EntityModal } from '../_component/entity-modal';
import { FieldDef, Row, UI } from '../_component/admin-ui';

const CATEGORIES = ['cPanel', 'Plesk', 'DirectAdmin', 'Other'] as const;

const FIELDS: Array<FieldDef> = [
  { key: 'name', label: 'License name', type: 'text', required: true },
  { key: 'category', label: 'Category', type: 'select', options: CATEGORIES },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'feature1', label: 'Feature 1', type: 'text' },
  { key: 'feature2', label: 'Feature 2', type: 'text' },
  { key: 'feature3', label: 'Feature 3', type: 'text' },
  { key: 'price', label: 'Price / mo ($)', type: 'number', required: true },
  { key: 'installFee', label: 'Install fee ($, one-time)', type: 'number' },
  { key: 'isActive', label: 'Shown on the website', type: 'checkbox' },
  { key: 'sortOrder', label: 'Sort order', type: 'number' },
];

@Component({
  selector: 'zx-admin-licenses',
  imports: [DataTable, EntityModal, ConfirmDialog],
  templateUrl: './licenses.html',
})
export class Licenses {
  protected readonly store = inject(AdminLicensesStore);
  private readonly toast = inject(AdminToastStore);

  protected readonly ui = UI;
  protected readonly fields = FIELDS;
  protected readonly columns = ['License', 'Category', 'Price', 'Install fee', 'Active'];

  protected readonly rows = computed<Array<Row<AdminLicense>>>(() =>
    this.store.items().map((license) => ({
      id: license._id,
      label: license.name,
      data: license,
      cells: [
        { text: license.name },
        { text: license.category, tint: 'neutral' },
        { text: `$${license.priceStr}/mo` },
        { text: `+$${Number(license.installFee).toFixed(0)} one-time` },
        {
          text: license.isActive ? 'Active' : 'Hidden',
          tint: license.isActive ? 'green' : 'neutral',
        },
      ],
    })),
  );

  protected readonly editing = signal<AdminLicense | null>(null);
  protected readonly modalOpen = signal(false);
  protected readonly draft = signal<Record<string, unknown>>({});
  protected readonly deleting = signal<Row<AdminLicense> | null>(null);

  constructor() {
    void this.store.load();
  }

  protected openAdd(): void {
    this.editing.set(null);
    this.draft.set({
      name: '',
      category: CATEGORIES[0],
      description: '',
      feature1: '',
      feature2: '',
      feature3: '',
      price: null,
      installFee: 0,
      isActive: true,
      sortOrder: 0,
    });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected openEdit(row: Row): void {
    const license = row.data as AdminLicense;
    const [feature1 = '', feature2 = '', feature3 = ''] = license.features;
    this.editing.set(license);
    this.draft.set({ ...license, feature1, feature2, feature3 });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected async save(draft: Record<string, unknown>): Promise<void> {
    const {
      feature1,
      feature2,
      feature3,
      _id,
      createdAt,
      updatedAt,
      priceStr,
      installFeeStr,
      features,
      ...rest
    } = draft as Record<string, any>;
    const body: Partial<AdminLicense> = {
      ...rest,
      features: [feature1, feature2, feature3].map((f) => String(f ?? '').trim()).filter(Boolean),
    };

    const editing = this.editing();
    const ok = editing ? await this.store.update(editing._id, body) : await this.store.create(body);

    if (ok) {
      this.modalOpen.set(false);
      this.toast.flash(editing ? 'License updated' : 'License added');
    }
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleting();
    if (!row) return;
    if (await this.store.remove(row.id)) {
      this.deleting.set(null);
      this.toast.flash('License deleted');
    }
  }
}
