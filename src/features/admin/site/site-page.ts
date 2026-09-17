/** ---------------------------------------------------------------------------------------------------------------------
 * @file site-page.ts
 * @fileOverview one component behind Home / About Us / Support / Footer / Legal (and the top half of
 *               Contact Us): the page comes from the `page` input when embedded, else from the
 *               route's `data.page`. Loading runs in an effect so it sees the input, not the
 *               constructor-time default.
 */
import { Component, computed, effect, inject, input, untracked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { AdminSiteContentStore, PageContent } from '@src/store/admin/admin-site-content.store';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';
import { SitePage as SitePageKey } from '@src/store/website/site-content.store';

import { PageEditor } from '../_component/page-editor';
import { SITE_CONFIGS } from '../_component/site-content-configs';

@Component({
  selector: 'zx-site-page',
  imports: [PageEditor],
  template: `
    @if (store.error() && !store.content()) {
      <div
        style="font-size:13px;color:#DC2626;background:#FFF6F6;border:1px solid #FBD5D5;border-radius:10px;padding:10px 12px;margin-bottom:14px;"
      >
        {{ store.error() }}
      </div>
    }
    <zx-page-editor
      [config]="configs[page()]"
      [content]="store.content()"
      [saving]="store.saving()"
      [error]="store.error()"
      (save)="save($event)"
    />
  `,
})
export class SitePage {
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(AdminToastStore);

  protected readonly store = inject(AdminSiteContentStore);
  protected readonly configs = SITE_CONFIGS;

  /** Contact Us embeds this component and passes the page directly; the other routes use `data`. */
  readonly pageInput = input<SitePageKey | null>(null, { alias: 'page' });

  private readonly routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });

  protected readonly page = computed<SitePageKey>(
    () => this.pageInput() ?? (this.routeData()['page'] as SitePageKey) ?? 'home',
  );

  constructor() {
    effect(() => {
      const page = this.page();
      untracked(() => void this.store.load(page));
    });
  }

  protected async save(content: PageContent): Promise<void> {
    if (await this.store.save(content)) this.toast.flash('Changes saved');
  }
}
