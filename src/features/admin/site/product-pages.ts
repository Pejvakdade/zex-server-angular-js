/** ---------------------------------------------------------------------------------------------------------------------
 * @file product-pages.ts
 * @fileOverview Site Content → one product page (VPS Hosting … Software Licenses): the product comes
 *               from the route's `data.product` (admin.routes.ts builds a route per PRODUCT_PAGES entry),
 *               so each sidebar item lands on its own editor like the reference's console.
 *               "Software Licenses" is included — content for it is stored as a seventh product even
 *               though it has no pricing plans.
 */
import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { AdminProductContentStore } from '@src/store/admin/admin-product-content.store';
import { PageContent } from '@src/store/admin/admin-site-content.store';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';

import { PageEditor } from '../_component/page-editor';
import { PRODUCT_CONFIG } from '../_component/site-content-configs';

@Component({
  selector: 'zx-product-pages',
  imports: [PageEditor],
  template: `
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
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(AdminToastStore);

  protected readonly store = inject(AdminProductContentStore);
  protected readonly config = PRODUCT_CONFIG;

  /** `data.product` from the route; the same component instance is reused when moving between products. */
  private readonly product = toSignal(this.route.data, { initialValue: this.route.snapshot.data });

  constructor() {
    effect(() => {
      const product = this.product()['product'] as string | undefined;
      if (product) void this.store.load(product);
    });
  }

  protected async save(content: PageContent): Promise<void> {
    if (await this.store.save(content)) this.toast.flash('Product page saved');
  }
}
