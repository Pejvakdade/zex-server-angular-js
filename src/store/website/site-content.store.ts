/** ---------------------------------------------------------------------------------------------------------------------
 * @file site-content.store.ts
 * @fileOverview content for the non-product pages plus the shared footer, keyed by page.
 */
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';

export type SitePage = 'home' | 'about' | 'contact' | 'support' | 'footer' | 'legal' | 'settings';

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
  /** pages with a request in flight — per page, so a page's skeleton doesn't wait on the footer fetch */
  pending: SitePage[];
};

export const SiteContentStore = signalStore(
  { providedIn: 'root' },
  withState<SiteContentState>({ byPage: {}, pending: [] }),
  withComputed(({ byPage, pending }) => ({
    loading: computed(() => pending().length > 0),
    isLoading: computed(
      () =>
        (page: SitePage): boolean =>
          pending().includes(page),
    ),
    forPage: computed(
      () =>
        <T = Record<string, unknown>>(page: SitePage): T | null =>
          (byPage()[page] as T) ?? null,
    ),
  })),
  withMethods((store, api = inject(ApiService)) => ({
    async load(page: SitePage): Promise<void> {
      if (page in store.byPage()) return;

      if (store.pending().includes(page)) return;

      patchState(store, { pending: [...store.pending(), page] });
      const done = (content: Record<string, unknown> | null) =>
        patchState(store, {
          byPage: { ...store.byPage(), [page]: content },
          pending: store.pending().filter((p) => p !== page),
        });
      try {
        done(
          await firstValueFrom(api.get<Record<string, unknown>>(apiRoutes.siteContentByPage(page))),
        );
      } catch {
        // null means "not published" — consumers render nothing rather than empty scaffolding.
        done(null);
      }
    },

    /** Drops a cached page so the next visit re-fetches — called after an admin save. */
    invalidate(page: SitePage): void {
      const { [page]: _dropped, ...rest } = store.byPage();
      patchState(store, { byPage: rest });
    },
  })),
);
