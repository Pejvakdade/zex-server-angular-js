/** ---------------------------------------------------------------------------------------------------------------------
 * @file site-meta.service.ts
 * @fileOverview the document-level bits the dashboard now edits: per-page <title> + meta description
 *               (product pages' SEO fields) and the site-wide favicon / social share image from
 *               Admin → Settings. Angular's Title / Meta cover the tags; the favicon <link> is
 *               swapped by hand since Meta only manages <meta>.
 */
import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { assetUrl } from './assetUrl';

export interface SiteSettings {
  siteName: string;
  logo: string;
  favicon: string;
  shareImage: string;
}

export const DEFAULT_SITE_NAME = 'ZexServer';

@Injectable({ providedIn: 'root' })
export class SiteMetaService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  /** One page's tab title + description; blank values fall back to the given defaults. */
  setPage(page: { title?: string | null; description?: string | null }, fallback: { title: string; description: string }): void {
    const title = page.title?.trim() || fallback.title;
    const description = page.description?.trim() || fallback.description;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
  }

  /** Site-wide favicon and share image; empty values leave the bundled defaults alone. */
  applyBrand(settings: Partial<SiteSettings> | null | undefined): void {
    if (!settings) return;

    if (settings.favicon) {
      const href = assetUrl(settings.favicon);
      this.document.querySelectorAll<HTMLLinkElement>('link[rel="icon"]').forEach((link) => link.remove());
      const link = this.document.createElement('link');
      link.rel = 'icon';
      link.href = href;
      this.document.head.appendChild(link);
    }

    if (settings.shareImage) {
      this.meta.updateTag({ property: 'og:image', content: assetUrl(settings.shareImage) });
    }
    if (settings.siteName) {
      this.meta.updateTag({ property: 'og:site_name', content: settings.siteName });
    }
  }
}
