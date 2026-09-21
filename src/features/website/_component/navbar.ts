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
import { assetUrl } from '@src/lib/assetUrl';
import { SiteSettings } from '@src/lib/site-meta.service';
import { AuthStore } from '@src/store/website/auth.store';
import { SiteContentStore } from '@src/store/website/site-content.store';
import { ThemeToggle } from '@src/shared/components/theme-toggle/theme-toggle';

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
  imports: [RouterLink, RouterLinkActive, ThemeToggle],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly router = inject(Router);
  private readonly siteContent = inject(SiteContentStore);

  protected readonly auth = inject(AuthStore);
  protected readonly routes = appRoutes;
  protected readonly menuOpen = signal(false);

  /** Admin → Settings: an uploaded logo replaces the bundled mark; the name is the image's alt text. */
  private readonly settings = computed(() => this.siteContent.forPage()<SiteSettings>('settings'));
  protected readonly logoUrl = computed(() => assetUrl(this.settings()?.logo) || 'uploads/zx-mark-cropped.png');
  protected readonly siteName = computed(() => this.settings()?.siteName || 'ZexServer');

  constructor() {
    void this.siteContent.load('settings');
  }

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

  /** Called from every nav link: collapses the mobile menu and drops focus so no dropdown lingers. */
  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.keyboardOpen.set(null);
    (document.activeElement as HTMLElement | null)?.blur();
  }

  /**
   * Which dropdown is held open by keyboard focus. Hover is pure CSS; this only exists so Tab can
   * travel from a trigger into its panel — with a CSS-only rule the panel disappears the instant
   * the trigger blurs, before the next link receives focus.
   */
  protected readonly keyboardOpen = signal<string | null>(null);

  protected onFocusIn(label: string, event: FocusEvent): void {
    // Only keyboard focus opens a panel; a mouse click also focuses, and must not hold it open.
    if ((event.target as Element).matches(':focus-visible')) this.keyboardOpen.set(label);
  }

  protected onFocusOut(event: FocusEvent): void {
    const drop = event.currentTarget as HTMLElement;
    if (!drop.contains(event.relatedTarget as Node | null)) this.keyboardOpen.set(null);
  }

  protected async signOut(): Promise<void> {
    this.auth.signOut();
    this.closeMenu();
    await this.router.navigateByUrl(appRoutes.Home);
  }
}
