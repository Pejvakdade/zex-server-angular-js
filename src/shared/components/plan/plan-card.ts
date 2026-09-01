/** ---------------------------------------------------------------------------------------------------------------------
 * @file plan-card.ts
 * @fileOverview one pricing card, ported verbatim from the reference product pages' plan loop.
 *               The two style variants are the reference's own `cardStyle` / `ctaStyle` branches.
 */
import { Component, computed, input } from '@angular/core';

import { Plan } from './plan.model';

const CARD_BASE = 'border-radius:18px;padding:24px 18px;position:relative;';
const CTA_BASE = 'display:block;text-align:center;padding:11px;border-radius:10px;font-weight:700;font-size:13px;';

@Component({
  selector: 'zx-plan-card',
  template: `
    <div [style]="cardStyle()">
      @if (plan().popular) {
        <div style="position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#1269E8,#7C3AED);color:#fff;font-size:10.5px;font-weight:800;padding:5px 12px;border-radius:20px;white-space:nowrap;">MOST POPULAR</div>
      }
      <div style="font-weight:700;font-size:15px;margin-bottom:4px;margin-top:6px;">{{ plan().name }}</div>
      <div style="font-size:12px;color:#8386AC;margin-bottom:14px;">{{ plan().tagline }}</div>
      <div style="font-size:26px;font-weight:800;">\${{ plan().priceStr }}<span style="font-size:12.5px;font-weight:600;color:#8386AC;">/mo</span></div>
      <div style="height:1px;background:#EEF0FA;margin:14px 0;"></div>
      <ul style="list-style:none;padding:0;margin:0 0 18px;display:flex;flex-direction:column;gap:9px;font-size:12.5px;color:#3A3D5C;">
        @for (feature of plan().featureList; track feature) {
          <li>&#10003; {{ feature }}</li>
        }
      </ul>
      <a href="#" [style]="ctaStyle()">Deploy Now</a>
    </div>
  `,
})
export class PlanCard {
  readonly plan = input.required<Plan>();

  protected readonly cardStyle = computed(() =>
    this.plan().popular
      ? `border:2px solid #1269E8;${CARD_BASE}box-shadow:0 16px 40px rgba(18,105,232,0.18);`
      : `border:1.5px solid #EEF0FA;${CARD_BASE}`,
  );

  protected readonly ctaStyle = computed(() =>
    this.plan().popular
      ? `${CTA_BASE}background:linear-gradient(135deg,#1269E8,#7C3AED);color:#fff;box-shadow:0 8px 20px rgba(18,105,232,0.28);`
      : `${CTA_BASE}border:1.5px solid #E0E3F5;color:#161629;`,
  );
}
