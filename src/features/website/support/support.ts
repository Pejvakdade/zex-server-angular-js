/** ---------------------------------------------------------------------------------------------------------------------
 * @file support.ts
 * @fileOverview the Support page, ported from the reference. Copy, knowledge-base categories and
 *               FAQs all come from site-content.
 *
 * @note The reference renders each knowledge-base card as `<a href="#">`. There are no article
 *       pages yet, so they are plain cards here — a link that goes nowhere is worse than no link,
 *       and the hover styling already signals they are coming.
 */
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { heroBackground } from '@src/lib/assetUrl';
import { SiteContentStore } from '@src/store/website/site-content.store';
import { Skeleton } from '@src/shared/components/skeleton/skeleton';

interface KbCategory {
  title: string;
  description: string;
  icon: string;
}

interface SupportContent {
  heroHeading: string;
  heroSubheading: string;
  /** Banner behind the hero text, uploaded from the dashboard (empty = gradient only). */
  heroImage?: string;
  kbCategories: Array<KbCategory>;
  faqs: Array<{ question: string; answer: string }>;
}

@Component({
  selector: 'zx-support',
  imports: [RouterLink, Skeleton],
  templateUrl: './support.html',
  styleUrl: './support.css',
})
export class Support {
  private readonly store = inject(SiteContentStore);

  protected readonly routes = appRoutes;
  protected readonly content = computed(() => this.store.forPage()<SupportContent>('support'));
  protected readonly heroBackground = computed(() => heroBackground(this.content()?.heroImage));
  protected readonly loading = computed(() => this.store.isLoading()('support'));

  constructor() {
    void this.store.load('support');
  }
}
