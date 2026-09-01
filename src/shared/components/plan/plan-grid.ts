/** ---------------------------------------------------------------------------------------------------------------------
 * @file plan-grid.ts
 * @fileOverview the pricing grid used by every product page. Handles the three states the reference
 *               never had to: still loading, loaded but empty, and loaded with plans.
 */
import { Component, input } from '@angular/core';

import { Plan } from './plan.model';
import { PlanCard } from './plan-card';

@Component({
  selector: 'zx-plan-grid',
  imports: [PlanCard],
  template: `
    <div style="max-width:1520px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;">
      @for (plan of plans(); track plan._id) {
        <zx-plan-card [plan]="plan" />
      } @empty {
        <!-- The reference always had plans baked in, so it has no empty state. Say what is
             actually true rather than rendering an empty grid that looks like a broken page. -->
        <p style="grid-column:1/-1;text-align:center;color:#8386AC;font-size:14px;padding:28px 0;">
          {{ loading() ? 'Loading plans…' : 'No plans are published for this product yet.' }}
        </p>
      }
    </div>
  `,
})
export class PlanGrid {
  readonly plans = input.required<Array<Plan>>();
  readonly loading = input(false);
}
