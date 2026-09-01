/** ---------------------------------------------------------------------------------------------------------------------
 * @file locations.ts
 * @fileOverview the Locations page, ported from the reference. Every card is a real location row.
 *
 * @note The reference embeds a D3 world map in an <iframe> that fetches country topology from a
 *       CDN. That is not ported: only five of the eight locations have coordinates in the
 *       reference, so the map would silently omit three real datacenters. The cards below show all
 *       eight. See the note in location.data.ts.
 */
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { LocationsStore } from '@src/store/website/locations.store';

@Component({
  selector: 'zx-locations',
  imports: [RouterLink],
  template: `
    <section style="padding:56px 64px 10px;font-family:var(--zx-font);">
      <h2 style="text-align:center;font-size:32px;font-weight:800;color:#161629;margin:0 0 6px;">Our Datacenters</h2>
      <p style="text-align:center;color:#8386AC;font-size:15px;margin:0 0 36px;">Pick a location and deploy in minutes.</p>

      <div class="zx-location-grid" style="max-width:1520px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
        @for (location of store.locations(); track location._id) {
          <div style="border:1px solid #EEF0FA;border-radius:18px;padding:26px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <span style="font-size:22px;">{{ location.flag }}</span>
              <div>
                <div style="font-weight:700;font-size:16px;">{{ location.city }}</div>
                <div style="font-size:12px;color:#8386AC;">{{ location.country }}</div>
              </div>
            </div>
            <div style="height:1px;background:#EEF0FA;margin:14px 0;"></div>
            <ul style="list-style:none;padding:0;margin:0 0 16px;display:flex;flex-direction:column;gap:8px;font-size:13px;color:#3A3D5C;">
              <li>&#10003; Datacenter: {{ location.datacenter }}</li>
              <li>&#10003; Network: {{ location.network }}</li>
              <li>&#10003; {{ location.latencyLabel }}: {{ location.latencyValue }}</li>
              <li>&#10003; {{ location.products.join(', ') }}</li>
            </ul>
            <div style="font-size:12px;color:#8386AC;margin-bottom:16px;">{{ location.description }}</div>
            <a [routerLink]="routes.VpsHosting" style="display:block;text-align:center;padding:11px;border-radius:10px;background:linear-gradient(135deg,#1269E8,#7C3AED);color:#fff;font-weight:700;font-size:13.5px;">Deploy in {{ location.city }} &rarr;</a>
          </div>
        } @empty {
          <p style="grid-column:1/-1;text-align:center;color:#8386AC;font-size:14px;padding:28px 0;">
            {{ store.loading() ? 'Loading locations…' : 'No locations are published yet.' }}
          </p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      /* The reference is a fixed three-column grid; it overflows below tablet width. */
      @media (max-width: 1000px) {
        .zx-location-grid {
          grid-template-columns: repeat(2, 1fr) !important;
        }
        :host ::ng-deep section {
          padding-left: 24px !important;
          padding-right: 24px !important;
        }
      }
      @media (max-width: 660px) {
        .zx-location-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `,
  ],
})
export class Locations {
  protected readonly store = inject(LocationsStore);
  protected readonly routes = appRoutes;

  constructor() {
    void this.store.load();
  }
}
