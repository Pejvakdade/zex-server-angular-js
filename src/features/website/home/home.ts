import { Component, OnInit, inject } from '@angular/core';

import { HealthStore } from '@src/store/website/health.store';

/**
 * Phase-1 placeholder. It exists to prove the full wiring end to end — routing, the API root and
 * bearer interceptor, the response-envelope unwrap, and the SignalStore pattern. The real Home page
 * is ported from ../ZexServerAdditionalPages/Home.dc.html in phase 4.
 */
@Component({
  selector: 'zx-home',
  template: `
    <main style="font-family: var(--zx-font); padding: 64px; text-align: center;">
      <h1 style="font-size: 52px; line-height: 1.12; font-weight: 800; color: var(--zx-ink); margin: 0 0 18px;">
        ZexServer
      </h1>

      @if (store.loading()) {
        <p style="color: var(--zx-text-faint)">Checking the backend…</p>
      } @else if (store.error()) {
        <p style="color: var(--zx-red-fg)">Backend unreachable — {{ store.error() }}</p>
      } @else if (store.status(); as status) {
        <p style="color: var(--zx-text)">
          API reachable — postgres: <strong>{{ status.postgres }}</strong>, redis:
          <strong>{{ status.redis }}</strong>
        </p>
      }
    </main>
  `,
})
export class Home implements OnInit {
  protected readonly store = inject(HealthStore);

  ngOnInit(): void {
    void this.store.load();
  }
}
