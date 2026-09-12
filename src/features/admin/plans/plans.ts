/** ---------------------------------------------------------------------------------------------------------------------
 * @file plans.ts
 * @fileOverview Pricing Plans: the reference's list section with its product chips, location select
 *               and name search (FILTER_CONFIG.plans), the REG.plans columns, and the add/edit modal
 *               whose spec inputs follow the chosen product (PLAN_FEATURE_FIELDS).
 */
import { Component, computed, inject, signal } from '@angular/core';

import {
  ALL_LOCATIONS,
  ALL_PRODUCTS,
  AdminPlan,
  AdminPlansStore,
} from '@src/store/admin/admin-plans.store';
import { AdminLocationsStore } from '@src/store/admin/admin-locations.store';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';

import { ConfirmDialog } from '../_component/confirm-dialog';
import { DataTable } from '../_component/data-table';
import { EntityModal } from '../_component/entity-modal';
import { FieldDef, Row, UI } from '../_component/admin-ui';

/** Same list as the backend's PlanNamespace.EPlanProduct. */
export const PLAN_PRODUCTS = [
  'VPS Hosting',
  'Windows VPS',
  'Trading VPS',
  'Dedicated Servers',
  'Web Hosting',
  'WordPress Hosting',
] as const;

/** Per-product spec inputs — copied from the reference's PLAN_FEATURE_FIELDS. */
const PLAN_FEATURE_FIELDS: Record<string, Array<FieldDef>> = {
  'VPS Hosting': [
    { key: 'cpu', label: 'vCPU Cores', type: 'text' },
    { key: 'ram', label: 'RAM', type: 'text' },
    { key: 'storage', label: 'NVMe SSD Storage', type: 'text' },
    { key: 'bandwidth', label: 'Bandwidth', type: 'text' },
    { key: 'ipv4', label: 'IPv4 Addresses', type: 'text' },
  ],
  'Windows VPS': [
    { key: 'cpu', label: 'vCPU Cores', type: 'text' },
    { key: 'ram', label: 'RAM', type: 'text' },
    { key: 'storage', label: 'NVMe SSD Storage', type: 'text' },
    { key: 'bandwidth', label: 'Bandwidth', type: 'text' },
  ],
  'Trading VPS': [
    { key: 'cpu', label: 'vCPU Cores', type: 'text' },
    { key: 'ram', label: 'RAM', type: 'text' },
    { key: 'storage', label: 'NVMe SSD Storage', type: 'text' },
    { key: 'network', label: 'Network Speed', type: 'text' },
    { key: 'ip', label: 'Dedicated IP', type: 'text' },
  ],
  'Dedicated Servers': [
    { key: 'processor', label: 'Processor & Cores', type: 'text' },
    { key: 'ram', label: 'RAM', type: 'text' },
    { key: 'storage', label: 'Storage (RAID)', type: 'text' },
    { key: 'bandwidth', label: 'Bandwidth', type: 'text' },
    { key: 'network', label: 'Network', type: 'text' },
    { key: 'ip', label: 'Dedicated IPv4', type: 'text' },
  ],
  'Web Hosting': [
    { key: 'storage', label: 'Storage', type: 'text' },
    { key: 'cpu', label: 'CPU Cores', type: 'text' },
    { key: 'ram', label: 'RAM', type: 'text' },
    { key: 'addonDomains', label: 'Addon Domains', type: 'text' },
  ],
  'WordPress Hosting': [
    { key: 'storage', label: 'Storage', type: 'text' },
    { key: 'cpu', label: 'CPU Cores', type: 'text' },
    { key: 'ram', label: 'RAM', type: 'text' },
    { key: 'sites', label: 'Websites', type: 'text' },
  ],
};

const SPEC_KEYS = [
  ...new Set(
    Object.values(PLAN_FEATURE_FIELDS)
      .flat()
      .map((f) => f.key),
  ),
];

@Component({
  selector: 'zx-admin-plans',
  imports: [DataTable, EntityModal, ConfirmDialog],
  templateUrl: './plans.html',
})
export class Plans {
  protected readonly store = inject(AdminPlansStore);
  protected readonly locations = inject(AdminLocationsStore);
  private readonly toast = inject(AdminToastStore);

  protected readonly ui = UI;
  protected readonly products = PLAN_PRODUCTS;
  protected readonly allProducts = ALL_PRODUCTS;
  protected readonly allLocations = ALL_LOCATIONS;
  protected readonly columns = [
    'Plan',
    'Product',
    'Location',
    'Price',
    'Tagline',
    'Popular',
    'Active',
  ];

  /** Location options: the first plan-location in the reference was the default for new plans. */
  protected readonly cities = computed(() => this.locations.items().map((l) => l.city));

  protected readonly rows = computed<Array<Row<AdminPlan>>>(() =>
    this.store.filtered().map((plan) => ({
      id: plan._id,
      label: plan.name,
      data: plan,
      cells: [
        { text: plan.name },
        { text: plan.product },
        { text: plan.location },
        { text: `$${plan.priceStr}/mo` },
        { text: plan.tagline || '—' },
        { text: plan.popular ? 'Popular' : '—', tint: plan.popular ? 'blue' : undefined },
        { text: plan.isActive ? 'Active' : 'Hidden', tint: plan.isActive ? 'green' : 'neutral' },
      ],
    })),
  );

  // modal state
  protected readonly editing = signal<AdminPlan | null>(null);
  protected readonly modalOpen = signal(false);
  protected readonly modalProduct = signal<string>(PLAN_PRODUCTS[0]);
  protected readonly draft = signal<Record<string, unknown>>({});
  protected readonly deleting = signal<Row<AdminPlan> | null>(null);

  protected readonly modalFields = computed<Array<FieldDef>>(() => [
    { key: 'product', label: 'Product', type: 'select', options: PLAN_PRODUCTS },
    { key: 'location', label: 'Location', type: 'select', options: this.cities() },
    { key: 'name', label: 'Plan name', type: 'text', required: true },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    { key: 'price', label: 'Price / mo ($)', type: 'number', required: true },
    { key: 'popular', label: 'Mark as popular', type: 'checkbox' },
    { key: 'isActive', label: 'Shown on the website', type: 'checkbox' },
    { key: 'sortOrder', label: 'Sort order', type: 'number' },
    ...(PLAN_FEATURE_FIELDS[this.modalProduct()] ?? []),
  ]);

  constructor() {
    void this.store.load();
    void this.locations.load();
  }

  protected openAdd(): void {
    const product = this.store.product() === ALL_PRODUCTS ? PLAN_PRODUCTS[0] : this.store.product();
    this.editing.set(null);
    this.modalProduct.set(product);
    this.draft.set({
      product,
      location: this.cities()[0] ?? '',
      name: '',
      tagline: '',
      price: null,
      popular: false,
      isActive: true,
      sortOrder: 0,
    });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected openEdit(row: Row): void {
    const plan = row.data as AdminPlan;
    this.editing.set(plan);
    this.modalProduct.set(plan.product);
    // specs are flattened into the draft so each spec is a plain input; split back on save.
    this.draft.set({ ...plan, ...plan.specs });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected onFieldChange(change: { key: string; value: string }): void {
    if (change.key === 'product') this.modalProduct.set(change.value);
  }

  protected async save(draft: Record<string, unknown>): Promise<void> {
    const specs: Record<string, string> = {};
    const body: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(draft)) {
      if (SPEC_KEYS.includes(key)) {
        if (value) specs[key] = String(value);
      } else if (
        !['_id', 'createdAt', 'updatedAt', 'priceStr', 'featureList', 'specs'].includes(key)
      ) {
        body[key] = value;
      }
    }
    // Only the current product's spec keys survive — switching product drops the others.
    const allowed = new Set((PLAN_FEATURE_FIELDS[this.modalProduct()] ?? []).map((f) => f.key));
    body['specs'] = Object.fromEntries(Object.entries(specs).filter(([key]) => allowed.has(key)));

    const editing = this.editing();
    const ok = editing
      ? await this.store.update(editing._id, body as Partial<AdminPlan>)
      : await this.store.create(body as Partial<AdminPlan>);

    if (ok) {
      this.modalOpen.set(false);
      this.toast.flash(editing ? 'Plan updated' : 'Plan added');
    }
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleting();
    if (!row) return;
    if (await this.store.remove(row.id)) {
      this.deleting.set(null);
      this.toast.flash('Plan deleted');
    }
  }

  protected onSearch(event: Event): void {
    this.store.setSearch((event.target as HTMLInputElement).value);
  }

  protected onLocation(event: Event): void {
    this.store.setLocation((event.target as HTMLSelectElement).value);
  }
}
