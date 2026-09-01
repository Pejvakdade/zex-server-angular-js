/** ---------------------------------------------------------------------------------------------------------------------
 * @file product.ts
 * @fileOverview one component serving all six product pages. Which product it shows comes from the
 *               route's `data.product`, so VPS Hosting and Web Hosting are the same page with
 *               different data rather than six near-identical copies.
 *
 * @note Only the pricing section is built here. The hero, feature strip and "why choose" blocks come
 *       from the productContent feature, which does not exist on the backend yet — rather than
 *       hardcoding the reference's copy and passing it off as content, those sections are simply
 *       absent until there is something real to render.
 */
import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PlansStore } from '@src/store/website/plans.store';
import { PlanGrid } from '@src/shared/components/plan/plan-grid';
import { PlanProduct } from '@src/shared/components/plan/plan.model';

@Component({
  selector: 'zx-product',
  imports: [PlanGrid],
  template: `
    <!-- pricing -->
    <section id="plans" style="padding:56px 64px 10px;font-family:var(--zx-font);">
      <h2 style="text-align:center;font-size:32px;font-weight:800;color:#161629;margin:0 0 6px;">
        Choose Your
        <span style="background:linear-gradient(135deg,#1269E8,#7C3AED);-webkit-background-clip:text;background-clip:text;color:transparent;">{{ product() }}</span>
      </h2>
      <p style="text-align:center;color:#8386AC;font-size:15px;margin:0 0 36px;">Flexible plans for every business and application.</p>

      <zx-plan-grid [plans]="plans()" [loading]="store.loading()" />
    </section>
  `,
})
export class Product implements OnInit {
  private readonly route = inject(ActivatedRoute);

  protected readonly store = inject(PlansStore);

  protected readonly product = computed(
    () => this.route.snapshot.data['product'] as PlanProduct,
  );

  protected readonly plans = computed(() => this.store.forProduct()(this.product()));

  ngOnInit(): void {
    void this.store.load(this.product());
  }
}
