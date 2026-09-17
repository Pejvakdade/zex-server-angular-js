/** ---------------------------------------------------------------------------------------------------------------------
 * @file my-services.ts
 * @fileOverview My Services: one card per service with its status pill, CPU / RAM / disk bars and
 *               expiry — the customer's view of the rows staff manage under Admin → Services.
 */
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { UI, pill } from '@src/features/admin/_component/admin-ui';
import { serviceTint } from '@src/features/admin/services/services';
import { MyServicesStore } from '@src/store/website/my-services.store';

@Component({
  selector: 'zx-my-services',
  imports: [RouterLink],
  templateUrl: './my-services.html',
})
export class MyServices {
  protected readonly store = inject(MyServicesStore);

  protected readonly ui = UI;
  protected readonly pill = pill;
  protected readonly tint = serviceTint;
  protected readonly routes = appRoutes;
  protected readonly meters: ReadonlyArray<{ key: 'cpu' | 'ram' | 'disk'; label: string }> = [
    { key: 'cpu', label: 'CPU' },
    { key: 'ram', label: 'RAM' },
    { key: 'disk', label: 'Disk' },
  ];

  constructor() {
    void this.store.load();
  }

  /** Bars turn amber past 75% and red past 90% — the usual "look at this" thresholds. */
  protected barColor(value: number): string {
    return value >= 90 ? '#DC2626' : value >= 75 ? '#B45309' : '#1269E8';
  }

  protected expires(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
