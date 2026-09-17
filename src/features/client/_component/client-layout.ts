/** ---------------------------------------------------------------------------------------------------------------------
 * @file client-layout.ts
 * @fileOverview the customer panel shell: the admin dashboard's topbar + sidebar, trimmed to four
 *               items and badged "My Account". There is no reference page for the panel, so it
 *               borrows the admin's chrome (admin-layout.css) rather than inventing a second look.
 */
import { Component, computed, inject } from '@angular/core';
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
import { SectionTitle } from '@src/features/admin/_component/admin-nav';
import { NavIcon } from '@src/features/admin/_component/nav-icon';
import { Toast } from '@src/features/admin/_component/toast';
import { AuthStore } from '@src/store/website/auth.store';

import { CLIENT_NAV } from './client-nav';

@Component({
  selector: 'zx-client-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NavIcon, Toast],
  templateUrl: './client-layout.html',
  styleUrl: '../../admin/_component/admin-layout.css',
})
export class ClientLayout {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly auth = inject(AuthStore);
  protected readonly routes = appRoutes;
  protected readonly items = CLIENT_NAV;

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

  protected signOut(): void {
    this.auth.signOut();
    void this.router.navigateByUrl(appRoutes.Home);
  }
}
