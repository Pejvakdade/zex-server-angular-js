/** ---------------------------------------------------------------------------------------------------------------------
 * @file home.ts
 * @fileOverview the Home page, ported from ../ZexServerAdditionalPages/Home.dc.html.
 *
 * @note Three things the reference hardcodes are not hardcoded here:
 *       - The star line ("4.8 out of 5 based on 1,265 reviews") is invented. `reviewScore` and
 *         `reviewCount` are seeded empty, so the line renders only once real figures are published.
 *       - The locations teaser lists five cities in the reference. It reads the location API here
 *         instead, so it can never disagree with the Locations page. The reference's D3 <iframe>
 *         map is rendered by <zx-locations-map> from the same rows — no iframe, no CDN.
 *       - The hero background and both product-card <image-slot>s are omitted — there is no media
 *         library yet, and About already sets the precedent of omitting a slot rather than
 *         rendering an empty grey box. The hero keeps its gradient wash and glow blobs.
 */
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { heroBackground } from '@src/lib/assetUrl';
import { BlogSlider } from '@src/shared/components/blog/blog-slider';
import { BlogStore } from '@src/store/website/blog.store';
import { LocationsMap } from '@src/shared/components/locations-map/locations-map';
import { LocationsStore } from '@src/store/website/locations.store';
import { SiteContentStore } from '@src/store/website/site-content.store';
import { Skeleton } from '@src/shared/components/skeleton/skeleton';

interface IconItem {
  title: string;
  subtitle: string;
  icon: string;
}

interface ProductCard {
  name: string;
  tagline: string;
  description: string;
  price: number;
  ctaLabel: string;
}

interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
}

interface HomeContent {
  heroBadge: string;
  heroHeading: string;
  heroSubheading: string;
  /** Banner behind the hero text, uploaded from the dashboard (empty = gradient only). */
  heroImage?: string;
  primaryCta: string;
  secondaryCta: string;
  reviewScore: string;
  reviewCount: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerCta: string;
  ctaHeading: string;
  ctaSubheading: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  features: Array<IconItem>;
  productCards: Array<ProductCard>;
  whyChoose: Array<IconItem>;
  testimonials: Array<Testimonial>;
}

/**
 * The seed stores an icon *name* per item rather than markup, so the names are mapped to the
 * reference's own 24x24 line glyphs here. An unknown name falls back to the globe rather than
 * leaving a hole in the grid.
 */
const ICONS: Record<string, string> = {
  bars: 'M4 18V9M10 18v-6M16 18v-9M22 18V5',
  globe: 'M3 12h18 M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z',
  shield: 'M12 3l7 3v5.5c0 4.3-2.9 7.8-7 9.5-4.1-1.7-7-5.2-7-9.5V6l7-3z M9 12.2l2 2 4-4.2',
  server: 'M3 5h18v14H3z M7 9h4M7 13h2 M17 8.5l-2.2 3.2h2.4L15 15.5',
  headset:
    'M4 14v-2a8 8 0 0116 0v2 M2.5 13.5h4v6h-4z M17.5 13.5h4v6h-4z M19.5 19.5v.5a2.5 2.5 0 01-2.5 2.5h-3',
  ticket:
    'M3 8.5a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 3v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-3z M14 7v10',
  gear: 'M14.5 3a5.5 5.5 0 00-4.9 8L3 17.6V21h3.4l6.6-6.6A5.5 5.5 0 0020.5 6.5l-3 3-2.5-2.5 3-3A5.5 5.5 0 0014.5 3z',
  license: 'M5 3h9l5 5v13H5z M14 3v5h5 M9 13h6M9 17h4',
};

/** The globe is the only glyph that reads as generic infrastructure, so it is the fallback. */
const FALLBACK_ICON = ICONS['globe'];

@Component({
  selector: 'zx-home',
  imports: [RouterLink, LocationsMap, Skeleton, BlogSlider],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly store = inject(SiteContentStore);

  protected readonly locationsStore = inject(LocationsStore);
  protected readonly blogStore = inject(BlogStore);
  protected readonly routes = appRoutes;
  protected readonly content = computed(() => this.store.forPage()<HomeContent>('home'));
  protected readonly heroBackground = computed(() => heroBackground(this.content()?.heroImage));
  protected readonly loading = computed(() => this.store.isLoading()('home'));

  /**
   * Null until both halves of the rating are published — a score with no review count, or a count
   * with no score, is worse than showing nothing.
   */
  protected readonly rating = computed(() => {
    const content = this.content();
    if (!content?.reviewScore || !content?.reviewCount) return null;

    return { score: content.reviewScore, count: content.reviewCount };
  });

  /**
   * The marquee scrolls a doubled list by -50%, so the seam is invisible only if the second copy
   * follows the first exactly. Duplicating here keeps that pairing in one place.
   */
  protected readonly marquee = computed(() => {
    const testimonials = this.content()?.testimonials ?? [];
    return [...testimonials, ...testimonials];
  });

  /** The reference alternates blue and purple down every icon grid. */
  protected accent(index: number): string {
    return index % 2 === 0 ? '#1269E8' : '#7C3AED';
  }

  /** A rating of 5 renders five stars. Angular templates cannot build a range inline. */
  protected stars(rating: number): Array<number> {
    return Array.from({ length: Math.max(0, Math.round(rating)) }, (_, i) => i);
  }

  protected iconPath(name: string): string {
    return ICONS[name] ?? FALLBACK_ICON;
  }

  constructor() {
    void this.store.load('home');
    void this.locationsStore.load();
    void this.blogStore.loadHome();
  }
}
