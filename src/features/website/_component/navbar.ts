/** ---------------------------------------------------------------------------------------------------------------------
 * @file navbar.ts
 * @fileOverview site header, ported from the reference pages' <nav>. Structure, styles and the
 *               grouping of the dropdowns are the reference's.
 *
 * @note Two things the reference could not have, being a static mockup: the CTAs reflect whether
 *       someone is signed in, and there is a mobile menu (its dropdowns open on hover, which a
 *       touch device does not have).
 */
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { AuthStore } from '@src/store/website/auth.store';

interface NavLink {
  label: string;
  path: string;
}

interface NavSection {
  heading?: string;
  links: Array<NavLink>;
}

interface NavMenu {
  label: string;
  sections: Array<NavSection>;
}

@Component({
  selector: 'zx-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly router = inject(Router);

  protected readonly auth = inject(AuthStore);
  protected readonly routes = appRoutes;
  protected readonly menuOpen = signal(false);

  /** Grouping and headings match the reference navbar exactly. */
  protected readonly menus: Array<NavMenu> = [
    {
      label: 'Servers',
      sections: [
        {
          heading: 'Virtual Servers',
          links: [
            { label: 'VPS Hosting', path: appRoutes.VpsHosting },
            { label: 'Windows VPS', path: appRoutes.WindowsVps },
            { label: 'Trading VPS', path: appRoutes.TradingVps },
          ],
        },
        {
          heading: 'Bare Metal',
          links: [{ label: 'Dedicated Servers', path: appRoutes.DedicatedServers }],
        },
      ],
    },
    {
      label: 'Hosting',
      sections: [
        {
          links: [
            { label: 'Web Hosting', path: appRoutes.WebHosting },
            { label: 'WordPress Hosting', path: appRoutes.WordPressHosting },
          ],
        },
      ],
    },
    {
      label: 'Company',
      sections: [
        {
          links: [
            { label: 'About Us', path: appRoutes.AboutUs },
            { label: 'Contact', path: appRoutes.ContactUs },
            { label: 'Support', path: appRoutes.Support },
          ],
        },
      ],
    },
  ];

  /** Staff go to the dashboard; customers go to their panel. */
  protected readonly dashboardLink = computed(() =>
    this.auth.isStaff() ? appRoutes.AdminDashboard : appRoutes.Account,
  );

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected async signOut(): Promise<void> {
    this.auth.signOut();
    this.closeMenu();
    await this.router.navigateByUrl(appRoutes.Home);
  }
}
