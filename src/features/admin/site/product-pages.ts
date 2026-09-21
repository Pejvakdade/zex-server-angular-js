/** ---------------------------------------------------------------------------------------------------------------------
 * @file product-pages.ts
 * @fileOverview Site Content → Product Pages: the reference's product <select> above the editor.
 *               "Software Licenses" is included — the reference stores content for it as a seventh
 *               product even though it has no pricing plans.
 */
import { Component, inject, signal } from '@angular/core';

import { AdminProductContentStore } from '@src/store/admin/admin-product-content.store';
import { PageContent } from '@src/store/admin/admin-site-content.store';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';

import { PageEditor } from '../_component/page-editor';
import { PRODUCT_CONFIG } from '../_component/site-content-configs';
import { UI } from '../_component/admin-ui';

const PC_PRODUCTS = [
  'VPS Hosting',
  'Windows VPS',
  'Trading VPS',
  'Dedicated Servers',
  'Web Hosting',
  'WordPress Hosting',
  'Software Licenses',
] as const;

@Component({
  selector: 'zx-product-pages',
  imports: [PageEditor],
  template: `
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:20px;max-width:320px;">
      <label [style]="ui.label">Product</label>
      <select [value]="product()" (change)="select($event)" [style]="ui.input">
        @for (p of products; track p) {
          <option [value]="p">{{ p }}</option>
        }
      </select>
    </div>
    @if (store.error() && !store.content()) {
      <div
        style="font-size:13px;color:var(--zx-red-fg);background:var(--zx-red-tint);border:1px solid var(--zx-red-border);border-radius:10px;padding:10px 12px;margin-bottom:14px;"
      >
        {{ store.error() }}
      </div>
    }
    <zx-page-editor
      [config]="config"
      [content]="store.content()"
      [saving]="store.saving()"
      [error]="store.error()"
      (save)="save($event)"
    />
  `,
})
export class ProductPages {
  private readonly toast = inject(AdminToastStore);

  protected readonly store = inject(AdminProductContentStore);
  protected readonly ui = UI;
  protected readonly products = PC_PRODUCTS;
  protected readonly config = PRODUCT_CONFIG;
  protected readonly product = signal<string>(PC_PRODUCTS[0]);

  constructor() {
    void this.store.load(this.product());
  }

  protected select(event: Event): void {
    this.product.set((event.target as HTMLSelectElement).value);
    void this.store.load(this.product());
  }

  protected async save(content: PageContent): Promise<void> {
    if (await this.store.save(content)) this.toast.flash('Product page saved');
  }
}
