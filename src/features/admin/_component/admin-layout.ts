/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-layout.ts
 * @fileOverview the dashboard shell — topbar, grouped sidebar, collapse, page heading — ported from
 *               ../ZexServerAdditionalPages/Admin Dashboard.dc.html. The reference switched sections
 *               in memory; here each item is a route and the heading comes from the route's `data`.
 *
 * @note The topbar bell is fed by GET /stats/activity (the Overview's feed): the dot shows while
 *       there is an open ticket or overdue invoice newer than the last time the dropdown was opened
 *       (remembered in localStorage), so it rings for real work and goes quiet once looked at.
 */
import { Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
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
import { AdminOverviewStore } from '@src/store/admin/admin-overview.store';
import { AuthStore } from '@src/store/website/auth.store';
import { timeAgo } from '@src/shared/components/ticket/ticket.model';

import { NAV_GROUPS, SectionTitle } from './admin-nav';
import { NavIcon } from './nav-icon';
import { Toast } from './toast';
import { ThemeToggle } from '@src/shared/components/theme-toggle/theme-toggle';

const COLLAPSE_KEY = 'zx_admin_sidebar_collapsed';
const BELL_SEEN_KEY = 'zx_admin_bell_seen';
/** How many feed rows the dropdown lists. */
const BELL_ROWS = 6;

/** Section each activity kind links to (same map as the Overview table). */
const ACTIVITY_LINKS = {
  ticket: appRoutes.AdminTickets,
  invoice: appRoutes.AdminBilling,
  service: appRoutes.AdminServices,
  customer: appRoutes.AdminCustomers,
} as const;

@Component({
  selector: 'zx-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NavIcon, Toast, ThemeToggle],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly overview = inject(AdminOverviewStore);

  protected readonly auth = inject(AuthStore);
  protected readonly routes = appRoutes;
  protected readonly groups = NAV_GROUPS;
  protected readonly activityLinks = ACTIVITY_LINKS;
  protected readonly timeAgo = timeAgo;

  protected readonly collapsed = signal(readCollapsed());

  // ---- notifications bell -------------------------------------------------------------------------------------
  protected readonly bellOpen = signal(false);
  private readonly bellSeenAt = signal(readBellSeen());

  protected readonly notifications = computed(() => this.overview.activity().slice(0, BELL_ROWS));

  /** Something staff must act on that arrived after the dropdown was last opened. */
  protected readonly hasUnread = computed(() => {
    const seen = this.bellSeenAt();
    return this.overview
      .activity()
      .some((item) => item.needsAttention && new Date(item.at).getTime() > seen);
  });

  constructor() {
    void this.overview.loadActivity();
  }

  protected toggleBell(): void {
    const open = !this.bellOpen();
    this.bellOpen.set(open);
    if (!open) return;

    void this.overview.loadActivity();
    const now = Date.now();
    this.bellSeenAt.set(now);
    try {
      localStorage.setItem(BELL_SEEN_KEY, String(now));
    } catch {
      // Storage blocked — the dot clears for this page load only.
    }
  }

  @HostListener('document:click', ['$event'])
  protected closeBellOutside(event: MouseEvent): void {
    if (!this.bellOpen()) return;
    const bell = this.host.nativeElement.querySelector('.zx-bell');
    if (bell && !bell.contains(event.target as Node)) this.bellOpen.set(false);
  }

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

function readBellSeen(): number {
  try {
    return Number(localStorage.getItem(BELL_SEEN_KEY)) || 0;
  } catch {
    return 0;
  }
}

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === 'true';
  } catch {
    return false;
  }
}
