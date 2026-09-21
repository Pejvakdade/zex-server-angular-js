/** ---------------------------------------------------------------------------------------------------------------------
 * @file section-placeholder.ts
 * @fileOverview empty-state card for sidebar items whose section is not built yet — Billing and
 *               Tickets wait on phase 6, the Site Content editors on the next slice of phase 5. The
 *               item stays in the sidebar so it matches the reference; the message comes from route data.
 */
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'zx-section-placeholder',
  template: `
    <div
      style="background:var(--zx-bg);border:1px solid var(--zx-border-soft);border-radius:16px;padding:40px 30px;box-shadow:0 4px 14px rgba(30,20,90,0.04);text-align:center;max-width:560px;"
    >
      <div
        style="width:44px;height:44px;border-radius:12px;background:var(--zx-surface-active);color:var(--zx-primary);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:20px;"
      >
        &#9203;
      </div>
      <div style="font-weight:800;font-size:16px;color:var(--zx-ink);margin-bottom:6px;">
        Not built yet
      </div>
      <p style="margin:0;font-size:13.5px;color:var(--zx-text-muted);">{{ note() }}</p>
    </div>
  `,
})
export class SectionPlaceholder {
  private readonly route = inject(ActivatedRoute);

  protected readonly note = toSignal(
    this.route.data.pipe(
      map((data) => (data['note'] as string) ?? 'This section arrives in a later phase.'),
    ),
    { initialValue: '' },
  );
}
