/** ---------------------------------------------------------------------------------------------------------------------
 * @file licenses.ts
 * @fileOverview the Software Licenses page. Licence cards come from the licence API; the hero,
 *               why-choose and FAQ come from productContent, where the reference stores content for
 *               "Software Licenses" as a seventh product.
 *
 * @note The reference's card shows a literal "$X.XX" placeholder for price - it is data-driven even
 *       in the mockup - plus an "Install License" checkbox that adds the one-off setup fee. That
 *       toggle is implemented here: ticking it shows the real total rather than only the monthly.
 */
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';

import appRoutes from '@src/common/appRoutes';
import { heroBackground } from '@src/lib/assetUrl';
import { DEFAULT_SITE_NAME, SiteMetaService } from '@src/lib/site-meta.service';
import { LicenseCard } from '@src/shared/components/license/license-card';
import { LineIcon } from '@src/shared/components/line-icon/line-icon';
import { License, LicensesStore } from '@src/store/website/licenses.store';
import { ProductContentStore } from '@src/store/website/product-content.store';
import { Skeleton } from '@src/shared/components/skeleton/skeleton';

const PRODUCT = 'Software Licenses';

@Component({
  selector: 'zx-licenses',
  imports: [RouterLink, UpperCasePipe, LineIcon, LicenseCard, Skeleton],
  templateUrl: './licenses.html',
  styleUrl: './licenses.css',
})
export class Licenses {
  private readonly siteMeta = inject(SiteMetaService);

  protected readonly store = inject(LicensesStore);
  protected readonly contentStore = inject(ProductContentStore);

  protected readonly routes = appRoutes;
  protected readonly content = computed(() => this.contentStore.forProduct()(PRODUCT));
  protected readonly heroBackground = computed(() => heroBackground(this.content()?.heroImage));

  /** Ids of licences whose install fee the visitor has opted into. */
  private readonly withInstall = signal<ReadonlySet<string>>(new Set());

  constructor() {
    void this.store.load();
    void this.contentStore.load(PRODUCT);

    effect(() => {
      const content = this.content();
      if (!content) return;
      this.siteMeta.setPage(
        { title: content.seoTitle, description: content.seoDescription },
        { title: `${PRODUCT} — ${DEFAULT_SITE_NAME}`, description: content.heroSubheading },
      );
    });
  }

  protected isInstalling(license: License): boolean {
    return this.withInstall().has(license._id);
  }

  protected toggleInstall(license: License): void {
    this.withInstall.update((current) => {
      const next = new Set(current);
      next.has(license._id) ? next.delete(license._id) : next.add(license._id);
      return next;
    });
  }
}
