/** ---------------------------------------------------------------------------------------------------------------------
 * @file app.ts
 * @fileOverview the root shell. Besides the outlet it fetches the `settings` site-content page once
 *               and applies the dashboard-managed favicon / share image to the document.
 */
import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteMetaService, SiteSettings } from '@src/lib/site-meta.service';
import { SiteContentStore } from '@src/store/website/site-content.store';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `<router-outlet />`,
})
export class App {
  private readonly siteContent = inject(SiteContentStore);
  private readonly siteMeta = inject(SiteMetaService);

  constructor() {
    void this.siteContent.load('settings');
    effect(() => this.siteMeta.applyBrand(this.siteContent.forPage()<SiteSettings>('settings')));
  }
}
