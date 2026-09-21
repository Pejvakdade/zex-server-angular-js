/** ---------------------------------------------------------------------------------------------------------------------
 * @file locations.ts
 * @fileOverview the Locations page, ported from the reference. Every card is a real location row.
 *
 * @note The reference embeds a D3 world map in an <iframe> that fetches country topology from a
 *       CDN. Here <zx-locations-map> draws it inline from the same rows as the cards.
 */
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { LocationsMap } from '@src/shared/components/locations-map/locations-map';
import { LocationsStore } from '@src/store/website/locations.store';
import { Skeleton } from '@src/shared/components/skeleton/skeleton';

@Component({
  selector: 'zx-locations',
  imports: [RouterLink, LocationsMap, Skeleton],
  template: `
    <section style="padding:56px 64px 10px;font-family:var(--zx-font);">
      <h2
        style="text-align:center;font-size:32px;font-weight:800;color:var(--zx-ink);margin:0 0 6px;"
      >
        Our Datacenters
      </h2>
      <p style="text-align:center;color:var(--zx-text-faint);font-size:15px;margin:0 0 36px;">
        Pick a location and deploy in minutes.
      </p>

      <div style="max-width:1520px;margin:0 auto 24px;">
        @if (store.loading() && !store.locations().length) {
          <div
            class="zx-skeleton"
            aria-busy="true"
            style="width:100%;aspect-ratio:2/1;max-height:520px;border-radius:18px;"
          ></div>
        } @else {
          <zx-locations-map [locations]="store.locations()" />
        }
      </div>

      <div
        class="zx-location-grid"
        style="max-width:1520px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;"
      >
        @for (location of store.locations(); track location._id) {
          <div style="border:1px solid var(--zx-border-soft);border-radius:18px;padding:26px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <span style="font-size:22px;">{{ location.flag }}</span>
              <div>
                <div style="font-weight:700;font-size:16px;">{{ location.city }}</div>
                <div style="font-size:12px;color:var(--zx-text-faint);">{{ location.country }}</div>
              </div>
            </div>
            <div style="height:1px;background:var(--zx-border-soft);margin:14px 0;"></div>
            <ul
              style="list-style:none;padding:0;margin:0 0 16px;display:flex;flex-direction:column;gap:8px;font-size:13px;color:var(--zx-text);"
            >
              <li>&#10003; Datacenter: {{ location.datacenter }}</li>
              <li>&#10003; Network: {{ location.network }}</li>
              <li>&#10003; {{ location.latencyLabel }}: {{ location.latencyValue }}</li>
              <li>&#10003; {{ location.products.join(', ') }}</li>
            </ul>
            <div style="font-size:12px;color:var(--zx-text-faint);margin-bottom:16px;">
              {{ location.description }}
            </div>
            <a
              [routerLink]="routes.VpsHosting"
              style="display:block;text-align:center;padding:11px;border-radius:10px;background:linear-gradient(135deg,var(--zx-primary),var(--zx-violet));color:var(--zx-on-accent);font-weight:700;font-size:13.5px;"
              >Deploy in {{ location.city }} &rarr;</a
            >
          </div>
        } @empty {
          @if (store.loading()) {
            <div style="grid-column:1/-1;margin:0 -64px;">
              <zx-skeleton kind="cards" [count]="6" [heading]="false" />
            </div>
          } @else {
            <p
              style="grid-column:1/-1;text-align:center;color:var(--zx-text-faint);font-size:14px;padding:28px 0;"
            >
              No locations are published yet.
            </p>
          }
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
