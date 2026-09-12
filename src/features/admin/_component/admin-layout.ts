/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-layout.ts
 * @fileOverview the dashboard shell — topbar, grouped sidebar, collapse, page heading — ported from
 *               ../ZexServerAdditionalPages/Admin Dashboard.dc.html. The reference switched sections
 *               in memory; here each item is a route and the heading comes from the route's `data`.
 *
 * @note The reference topbar also had a notifications bell fed by mock service alerts. It is left
 *       out until phase 6 gives it a real source rather than shipping a bell that never rings.
 */
import { Component, computed, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import appRoutes from '@src/common/appRoutes';
import { AuthStore } from '@src/store/website/auth.store';

import { NAV_GROUPS, SectionTitle } from './admin-nav';
import { NavIcon } from './nav-icon';
import { Toast } from './toast';

const COLLAPSE_KEY = 'zx_admin_sidebar_collapsed';

@Component({
  selector: 'zx-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NavIcon, Toast],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly auth = inject(AuthStore);
  protected readonly routes = appRoutes;
  protected readonly groups = NAV_GROUPS;

  protected readonly collapsed = signal(readCollapsed());

  /** The deepest active child's `data.section` → its heading. */
  protected readonly section = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let current = this.route;
        while (current.firstChild) current = current.firstChild;
        return (current.snapshot?.data?.['section'] ?? { title: '', subtitle: '' }) as SectionTitle;
      }),
    ),
    { initialValue: { title: '', subtitle: '' } as SectionTitle },
  );

  protected readonly initials = computed(() =>
    (this.auth.user()?.fullName ?? '')
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );

  protected toggleSidebar(): void {
    this.collapsed.update((value) => !value);
    try {
      localStorage.setItem(COLLAPSE_KEY, String(this.collapsed()));
    } catch {
      // Private mode or storage blocked — the toggle still works for this page load.
    }
  }

  protected signOut(): void {
    this.auth.signOut();
    void this.router.navigateByUrl(appRoutes.AdminLogin);
  }
}

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === 'true';
  } catch {
    return false;
  }
}
