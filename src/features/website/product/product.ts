/** ---------------------------------------------------------------------------------------------------------------------
 * @file product.ts
 * @fileOverview one component serving all six product pages. Which product it shows comes from the
 *               route's `data.product`, so VPS Hosting and Web Hosting are the same page with
 *               different data rather than six near-identical copies.
 *
 * @note Every section except the pricing grid is driven by the productContent API and renders only
 *       when that content exists — no copy is hardcoded here. If content is missing the page
 *       degrades to the pricing grid rather than showing empty headings.
 */
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import appRoutes from '@src/common/appRoutes';
import { LocationsStore } from '@src/store/website/locations.store';
import { PlansStore } from '@src/store/website/plans.store';
import { ProductContentStore } from '@src/store/website/product-content.store';
import { LineIcon } from '@src/shared/components/line-icon/line-icon';
import { LocationsMap } from '@src/shared/components/locations-map/locations-map';
import { PlanSelector } from '@src/shared/components/plan/plan-selector';
import { PlanProduct } from '@src/shared/components/plan/plan.model';

@Component({
  selector: 'zx-product',
  imports: [PlanSelector, RouterLink, LocationsMap, LineIcon],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  private readonly route = inject(ActivatedRoute);

  protected readonly plansStore = inject(PlansStore);
  protected readonly contentStore = inject(ProductContentStore);
  /** the full fleet for the map — productContent.locations carries copy per product but no coordinates */
  protected readonly locationsStore = inject(LocationsStore);
  protected readonly routes = appRoutes;

  /**
   * Tracked reactively rather than read from `snapshot`: the six product routes share this
   * component, so navigating between them reuses the instance and a snapshot would stay stuck on
   * whichever product was loaded first.
   */
  protected readonly product = signal<PlanProduct>(
    this.route.snapshot.data['product'] as PlanProduct,
  );
  protected readonly plans = computed(() => this.plansStore.forProduct()(this.product()));
  protected readonly content = computed(() => this.contentStore.forProduct()(this.product()));
  /** the plan card's extra bullets, as plain strings */
  protected readonly includedFeatures = computed(
    () => this.content()?.includedFeatures?.map((item) => item.label) ?? [],
  );

  /** The two icon grids are structurally identical, so the template renders them from one loop. */
  protected readonly grids = computed(() => {
    const content = this.content();
    if (!content) return [];

    return [
      { title: content.gridOneTitle, subtitle: content.gridOneSubtitle, items: content.gridOne },
      { title: content.gridTwoTitle, subtitle: content.gridTwoSubtitle, items: content.gridTwo },
    ].filter((grid) => grid.items?.length);
  });

  constructor() {
    void this.locationsStore.load();
    this.route.data
      .pipe(takeUntilDestroyed())
      .subscribe((data) => this.product.set(data['product'] as PlanProduct));

    // Fetches on first render and again whenever the route's product changes.
    effect(() => {
      const product = this.product();
      void this.plansStore.load(product);
      void this.contentStore.load(product);
    });
  }
}
