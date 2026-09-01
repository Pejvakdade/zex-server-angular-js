/** ---------------------------------------------------------------------------------------------------------------------
 * @file site-content.store.ts
 * @fileOverview content for the non-product pages plus the shared footer, keyed by page.
 */
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';

export type SitePage = 'home' | 'about' | 'contact' | 'support' | 'footer' | 'legal';

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterContent {
  tagline: string;
  copyright: string;
  columns: Array<{ heading: string; links: Array<FooterLink> }>;
  social: Array<{ label: string; url: string; icon: string }>;
}

type SiteContentState = {
  byPage: Record<string, Record<string, unknown> | null>;
  loading: boolean;
};

export const SiteContentStore = signalStore(
  { providedIn: 'root' },
  withState<SiteContentState>({ byPage: {}, loading: false }),
  withComputed(({ byPage }) => ({
    forPage: computed(
      () =>
        <T = Record<string, unknown>>(page: SitePage): T | null =>
          (byPage()[page] as T) ?? null,
    ),
  })),
  withMethods((store, api = inject(ApiService)) => ({
    async load(page: SitePage): Promise<void> {
      if (page in store.byPage()) return;

      patchState(store, { loading: true });
      try {
        const content = await firstValueFrom(
          api.get<Record<string, unknown>>(apiRoutes.siteContentByPage(page)),
        );
        patchState(store, { byPage: { ...store.byPage(), [page]: content }, loading: false });
      } catch {
        // null means "not published" — consumers render nothing rather than empty scaffolding.
        patchState(store, { byPage: { ...store.byPage(), [page]: null }, loading: false });
      }
    },
  })),
);
