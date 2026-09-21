/** ---------------------------------------------------------------------------------------------------------------------
 * @file about.ts
 * @fileOverview the About Us page, ported from the reference. Copy comes from site-content.
 *
 * @note The stats strip is the interesting part. The reference hardcodes four figures — Founded
 *       2015, 5 Global Datacenters, 12,000+ Servers Deployed, 99.9% Network Uptime — and its own
 *       "5" contradicts the eight locations it lists elsewhere. Founded / servers / uptime are
 *       site-content fields (seeded with the reference's figures, editable in admin; a blank one
 *       hides its tile). The datacenter count is a countable fact, so it comes from the stats API.
 *
 *       The hero uses the product-page hero pattern rather than the reference's About-specific
 *       fade-to-white one, so the two page families look like one site.
 */
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { heroBackground } from '@src/lib/assetUrl';
import { FleetStatsStore } from '@src/store/website/fleet-stats.store';
import { SiteContentStore } from '@src/store/website/site-content.store';
import { Skeleton } from '@src/shared/components/skeleton/skeleton';

interface AboutValue {
  title: string;
  description: string;
}

interface AboutContent {
  heroHeading: string;
  heroSubheading: string;
  /** Banner behind the hero text, uploaded from the dashboard (empty = gradient only). */
  heroImage?: string;
  founded: string;
  datacentersCount: string;
  serversDeployed: string;
  uptime: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;
  ctaHeading: string;
  ctaSubheading: string;
  values: Array<AboutValue>;
}

@Component({
  selector: 'zx-about',
  imports: [RouterLink, Skeleton],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  private readonly store = inject(SiteContentStore);
  private readonly stats = inject(FleetStatsStore);

  protected readonly routes = appRoutes;
  protected readonly content = computed(() => this.store.forPage()<AboutContent>('about'));
  protected readonly heroBackground = computed(() => heroBackground(this.content()?.heroImage));
  protected readonly loading = computed(() => this.store.isLoading()('about'));

  /**
   * Only tiles with a real value are shown. An empty strip disappears entirely rather than
   * rendering four blank boxes.
   */
  protected readonly statTiles = computed(() => {
    const content = this.content();
    if (!content) return [];

    const datacenters = this.stats.stats().locations;

    return [
      { value: content.founded, label: 'Founded' },
      // Counted from the location table, not typed into content.
      { value: datacenters === null ? '' : String(datacenters), label: 'Global Datacenters' },
      { value: content.serversDeployed, label: 'Servers Deployed' },
      { value: content.uptime, label: 'Network Uptime' },
    ].filter((tile) => tile.value);
  });

  constructor() {
    void this.store.load('about');
    void this.stats.load();
  }
}
