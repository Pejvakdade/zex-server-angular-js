/** ---------------------------------------------------------------------------------------------------------------------
 * @file order-confirm.ts
 * @fileOverview the checkout step of "Choose This Plan": show the plan (and the control panel picked
 *               with it, if any) once more, place the order, and hand the customer over to My
 *               Services. There is no payment form — the API approves every order for now — but
 *               this is where one would go.
 */
import { Component, computed, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { UI } from '@src/features/admin/_component/admin-ui';
import { LicensesStore } from '@src/store/website/licenses.store';
import { OrderStore } from '@src/store/website/order.store';

@Component({
  selector: 'zx-order-confirm',
  imports: [RouterLink],
  templateUrl: './order-confirm.html',
})
export class OrderConfirm {
  private readonly router = inject(Router);

  protected readonly store = inject(OrderStore);
  private readonly licenses = inject(LicensesStore);
  protected readonly ui = UI;
  protected readonly routes = appRoutes;

  /** Bound from the `:planId` route param (withComponentInputBinding). */
  readonly planId = input.required<string>();
  /** `?license=<id>&install=1` — the control panel picked on the product page, if any. */
  readonly license = input<string | undefined>(undefined);
  readonly install = input<string | undefined>(undefined);

  protected readonly addOn = computed(() => {
    const id = this.license();
    return id ? (this.licenses.licenses().find((license) => license._id === id) ?? null) : null;
  });
  protected readonly installing = computed(() => !!this.addOn() && this.install() === '1');

  /** Recurring monthly figure and the first invoice (which may include the one-off install). */
  protected readonly monthly = computed(() => (this.store.plan()?.price ?? 0) + (this.addOn()?.price ?? 0));
  protected readonly firstMonth = computed(
    () => this.monthly() + (this.installing() ? (this.addOn()?.installFee ?? 0) : 0),
  );

  constructor() {
    toObservable(this.planId).subscribe((planId) => void this.store.loadPlan(planId));
    void this.licenses.load();
  }

  protected async confirm(): Promise<void> {
    const addOn = this.addOn();
    const result = await this.store.place(
      this.planId(),
      addOn ? { licenseId: addOn._id, installLicense: this.installing() } : {},
    );
    if (result) await this.router.navigateByUrl(appRoutes.AccountServices);
  }
}
