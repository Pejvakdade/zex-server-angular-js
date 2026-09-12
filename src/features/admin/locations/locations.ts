/** ---------------------------------------------------------------------------------------------------------------------
 * @file locations.ts
 * @fileOverview Locations: the REG.locations table and the LOCATION_FIELDS modal, extended with the
 *               columns the entity actually has (country, the split latency label/value, products).
 *               The reference's "Services" column derived from plans; here it lists the products
 *               the location card advertises.
 */
import { Component, computed, inject, signal } from '@angular/core';

import { AdminLocation, AdminLocationsStore } from '@src/store/admin/admin-locations.store';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';

import { ConfirmDialog } from '../_component/confirm-dialog';
import { DataTable } from '../_component/data-table';
import { EntityModal } from '../_component/entity-modal';
import { FieldDef, Row, UI } from '../_component/admin-ui';
import { PLAN_PRODUCTS } from '../plans/plans';

const FIELDS: Array<FieldDef> = [
  { key: 'flag', label: 'Flag emoji', type: 'text', required: true },
  { key: 'city', label: 'City', type: 'text', required: true },
  { key: 'country', label: 'Country', type: 'text', required: true },
  { key: 'datacenter', label: 'Datacenter', type: 'text', required: true },
  { key: 'network', label: 'Network', type: 'text', required: true },
  {
    key: 'latencyLabel',
    label: 'Latency label (e.g. "Latency to EU")',
    type: 'text',
    required: true,
  },
  { key: 'latencyValue', label: 'Latency value (e.g. "< 10 ms")', type: 'text', required: true },
  { key: 'products', label: 'Products offered here', type: 'multiselect', options: PLAN_PRODUCTS },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'latitude', label: 'Latitude (optional)', type: 'number' },
  { key: 'longitude', label: 'Longitude (optional)', type: 'number' },
  { key: 'isActive', label: 'Shown on the website', type: 'checkbox' },
  { key: 'sortOrder', label: 'Sort order', type: 'number' },
];

@Component({
  selector: 'zx-admin-locations',
  imports: [DataTable, EntityModal, ConfirmDialog],
  templateUrl: './locations.html',
})
export class Locations {
  protected readonly store = inject(AdminLocationsStore);
  private readonly toast = inject(AdminToastStore);

  protected readonly ui = UI;
  protected readonly fields = FIELDS;
  protected readonly columns = [
    'Location',
    'Datacenter',
    'Network',
    'Latency',
    'Products',
    'Active',
  ];

  protected readonly rows = computed<Array<Row<AdminLocation>>>(() =>
    this.store.items().map((location) => ({
      id: location._id,
      label: location.city,
      data: location,
      cells: [
        { text: `${location.flag} ${location.city}, ${location.country}` },
        { text: location.datacenter },
        { text: location.network },
        { text: `${location.latencyLabel}: ${location.latencyValue}` },
        { text: location.products.length ? location.products.join(', ') : '—' },
        {
          text: location.isActive ? 'Active' : 'Hidden',
          tint: location.isActive ? 'green' : 'neutral',
        },
      ],
    })),
  );

  protected readonly editing = signal<AdminLocation | null>(null);
  protected readonly modalOpen = signal(false);
  protected readonly draft = signal<Record<string, unknown>>({});
  protected readonly deleting = signal<Row<AdminLocation> | null>(null);

  constructor() {
    void this.store.load();
  }

  protected openAdd(): void {
    this.editing.set(null);
    this.draft.set({
      flag: '',
      city: '',
      country: '',
      datacenter: '',
      network: '',
      latencyLabel: '',
      latencyValue: '',
      products: [],
      description: '',
      latitude: null,
      longitude: null,
      isActive: true,
      sortOrder: 0,
    });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected openEdit(row: Row): void {
    const location = row.data as AdminLocation;
    this.editing.set(location);
    this.draft.set({ ...location });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected async save(draft: Record<string, unknown>): Promise<void> {
    const { _id, createdAt, updatedAt, ...body } = draft as Record<string, any>;
    const editing = this.editing();
    const ok = editing ? await this.store.update(editing._id, body) : await this.store.create(body);

    if (ok) {
      this.modalOpen.set(false);
      this.toast.flash(editing ? 'Location updated' : 'Location added');
    }
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleting();
    if (!row) return;
    if (await this.store.remove(row.id)) {
      this.deleting.set(null);
      this.toast.flash('Location deleted');
    }
  }
}
