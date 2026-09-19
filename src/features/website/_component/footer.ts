/** ---------------------------------------------------------------------------------------------------------------------
 * @file footer.ts
 * @fileOverview site footer, ported from the reference. Every string comes from the site-content
 *               API — the tagline, copyright, all four link columns and the social links.
 *
 * @note The whole footer renders only once content loads, rather than showing an empty dark slab.
 */
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LineIcon } from '@src/shared/components/line-icon/line-icon';
import { FooterContent, SiteContentStore } from '@src/store/website/site-content.store';

@Component({
  selector: 'zx-footer',
  imports: [RouterLink, LineIcon],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private readonly store = inject(SiteContentStore);

  protected readonly footer = computed(() => this.store.forPage()<FooterContent>('footer'));

  constructor() {
    void this.store.load('footer');
  }
}
