/** ---------------------------------------------------------------------------------------------------------------------
 * @file plan-selector.ts
 * @fileOverview the pricing block on every product page: a row of plan tabs and one detail card for
 *               the selected plan. Ported from the Web Hosting / WordPress Hosting reference pages and
 *               used for all six products, replacing the earlier card-per-plan grid.
 *
 * @note The card's checklist is the plan's own `featureList` (built by the API from its specs) followed
 *       by the product's `includedFeatures` from productContent — the extras the reference hardcoded
 *       per page ("Free SSL Certificate", "LiteSpeed Web Server", …), now admin-editable.
 */
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { Plan, PlanProduct } from './plan.model';

/** Hosting plans are picked by size, so their tab shows the storage figure rather than "1 GB Hosting". */
const SIZE_LABELLED: ReadonlySet<PlanProduct> = new Set<PlanProduct>(['Web Hosting', 'WordPress Hosting']);

@Component({
  selector: 'zx-plan-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './plan-selector.html',
  styleUrl: './plan-selector.css',
})
export class PlanSelector {
  readonly plans = input.required<Array<Plan>>();
  readonly product = input.required<PlanProduct>();
  readonly includedFeatures = input<Array<string>>([]);
  readonly loading = input(false);

  protected readonly routes = appRoutes;

  /** index into plans(); starts on the popular plan, else the first */
  protected readonly selected = signal(0);

  constructor() {
    // Reset whenever the plan list changes — the component is shared across product routes.
    effect(() => {
      const popular = this.plans().findIndex((plan) => plan.popular);
      this.selected.set(Math.max(0, popular));
    });
  }

  protected readonly current = computed<Plan | undefined>(() => this.plans()[this.selected()]);

  protected label(plan: Plan): string {
    return (SIZE_LABELLED.has(this.product()) && plan.specs?.['storage']) || plan.name;
  }

  /** feature bullets split into two columns, the left one taking the odd item */
  protected readonly columns = computed<[Array<string>, Array<string>]>(() => {
    const plan = this.current();
    if (!plan) return [[], []];
    const all = [...plan.featureList, ...this.includedFeatures()];
    const half = Math.ceil(all.length / 2);
    return [all.slice(0, half), all.slice(half)];
  });

  protected select(index: number): void {
    this.selected.set(index);
  }
}
