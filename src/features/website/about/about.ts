/** ---------------------------------------------------------------------------------------------------------------------
 * @file about.ts
 * @fileOverview the About Us page, ported from the reference. Copy comes from site-content.
 *
 * @note The stats strip is the interesting part. The reference hardcodes four figures — Founded
 *       2015, 5 Global Datacenters, 12,000+ Servers Deployed, 99.9% Network Uptime — and its own
 *       "5" contradicts the eight locations it lists elsewhere. Those fields are seeded empty, so
 *       each tile renders only once someone enters a real value. The datacenter count is the
 *       exception: it is a countable fact, so it comes from the stats API.
 */
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { FleetStatsStore } from '@src/store/website/fleet-stats.store';
import { SiteContentStore } from '@src/store/website/site-content.store';

interface AboutValue {
  title: string;
  description: string;
}

interface AboutContent {
  heroHeading: string;
  heroSubheading: string;
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
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  private readonly store = inject(SiteContentStore);
  private readonly stats = inject(FleetStatsStore);

  protected readonly routes = appRoutes;
  protected readonly content = computed(() => this.store.forPage()<AboutContent>('about'));

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
