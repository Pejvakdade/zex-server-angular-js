/** ---------------------------------------------------------------------------------------------------------------------
 * @file services.ts
 * @fileOverview Admin → Services: the reference's REG.services table (Service ID, Customer, Product,
 *               Status, usage, Location, Expires) and its SERVICE_FIELDS modal, over the real
 *               `service` table.
 */
import { Component, computed, inject, signal } from '@angular/core';

import { AdminLocationsStore } from '@src/store/admin/admin-locations.store';
import { AdminServicesStore, Service, ServiceStatus } from '@src/store/admin/admin-services.store';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';

import { ConfirmDialog } from '../_component/confirm-dialog';
import { CustomerOptions, customerLabel } from '../_component/customer-options';
import { DataTable } from '../_component/data-table';
import { EntityModal } from '../_component/entity-modal';
import { FieldDef, Row, Tint, UI } from '../_component/admin-ui';
import { Pager } from '../_component/pager';
import { PLAN_PRODUCTS } from '../plans/plans';

const STATUSES: ReadonlyArray<ServiceStatus> = ['Running', 'Issue', 'Suspended', 'Active'];

export const serviceTint = (status: ServiceStatus): Tint =>
  status === 'Running' || status === 'Active' ? 'green' : status === 'Issue' ? 'amber' : 'red';

/** "22% / 41% / 30%", or a dash for products without a server behind them. */
export const usage = (service: Pick<Service, 'cpu' | 'ram' | 'disk'>): string =>
  service.cpu == null && service.ram == null && service.disk == null
    ? '—'
    : [service.cpu, service.ram, service.disk].map((v) => (v == null ? '–' : `${v}%`)).join(' / ');

@Component({
  selector: 'zx-admin-services',
  imports: [DataTable, EntityModal, ConfirmDialog, Pager],
  templateUrl: './services.html',
})
export class Services {
  protected readonly store = inject(AdminServicesStore);
  private readonly locations = inject(AdminLocationsStore);
  private readonly customers = inject(CustomerOptions);
  private readonly toast = inject(AdminToastStore);

  protected readonly ui = UI;
  protected readonly statuses = STATUSES;
  protected readonly products = PLAN_PRODUCTS;
  protected readonly columns = [
    'Service ID',
    'Customer',
    'Product',
    'Status',
    'CPU / RAM / Disk',
    'Location',
    'Expires',
  ];

  protected readonly fields = computed<Array<FieldDef>>(() => [
    { key: 'serviceId', label: 'Service ID', type: 'text', required: true },
    { key: 'customerId', label: 'Customer', type: 'select', options: this.customers.options() },
    { key: 'product', label: 'Product', type: 'select', options: PLAN_PRODUCTS },
    { key: 'label', label: 'Plan name', type: 'text', required: true },
    { key: 'status', label: 'Status', type: 'select', options: STATUSES },
    { key: 'cpu', label: 'CPU %', type: 'number' },
    { key: 'ram', label: 'RAM %', type: 'number' },
    { key: 'disk', label: 'Disk %', type: 'number' },
    {
      key: 'location',
      label: 'Location',
      type: 'select',
      options: this.locations.items().map((location) => location.city),
    },
    { key: 'expiresAt', label: 'Expires', type: 'date', required: true },
    { key: 'monthlyPrice', label: 'Monthly price ($)', type: 'number' },
  ]);

  protected readonly rows = computed<Array<Row<Service>>>(() =>
    this.store.page().docs.map((service) => ({
      id: service._id,
      label: service.serviceId,
      data: service,
      cells: [
        { text: service.serviceId },
        { text: customerLabel(service.customer) },
        { text: service.product },
        { text: service.status, tint: serviceTint(service.status) },
        { text: usage(service) },
        { text: service.location || '—' },
        { text: new Date(service.expiresAt).toLocaleDateString() },
      ],
    })),
  );

  protected readonly editing = signal<Service | null>(null);
  protected readonly modalOpen = signal(false);
  protected readonly draft = signal<Record<string, unknown>>({});
  protected readonly deleting = signal<Row<Service> | null>(null);

  constructor() {
    void this.store.load();
    void this.customers.load();
    if (!this.locations.loaded()) void this.locations.load();
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.draft.set({
      serviceId: '',
      customerId: '',
      product: PLAN_PRODUCTS[0],
      label: '',
      status: 'Running',
      cpu: null,
      ram: null,
      disk: null,
      location: this.locations.items()[0]?.city ?? '',
      expiresAt: '',
      monthlyPrice: 0,
    });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected openEdit(row: Row): void {
    const service = row.data as Service;
    this.editing.set(service);
    this.draft.set({
      serviceId: service.serviceId,
      customerId: service.customerId,
      product: service.product,
      label: service.label,
      status: service.status,
      cpu: service.cpu,
      ram: service.ram,
      disk: service.disk,
      location: service.location,
      expiresAt: service.expiresAt,
      monthlyPrice: service.monthlyPrice,
    });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected async save(draft: Record<string, unknown>): Promise<void> {
    const body = draft as Partial<Service>;
    const editing = this.editing();
    const ok = editing ? await this.store.update(editing._id, body) : await this.store.create(body);
    if (ok) {
      this.modalOpen.set(false);
      this.toast.flash(editing ? 'Service updated' : 'Service provisioned');
    }
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleting();
    if (!row) return;
    if (await this.store.remove(row.id)) {
      this.deleting.set(null);
      this.toast.flash('Service deleted');
    }
  }

  protected setStatus(status: ServiceStatus | null): void {
    this.store.setFilter('status', status);
    void this.store.load();
  }

  protected onProduct(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.setFilter('product', value || null);
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
