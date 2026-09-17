/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-site-content.store.ts
 * @fileOverview one site page's content object for the editor. `save` replaces the whole object
 *               (the backend's PATCH is a full replace, like the reference's per-page `db` slot) and
 *               drops the public site's cached copy so the change shows on the next visit.
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';
import { SiteContentStore, SitePage } from '@src/store/website/site-content.store';

export type PageContent = Record<string, unknown>;

type State = {
  page: SitePage | null;
  content: PageContent | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
};

export const AdminSiteContentStore = signalStore(
  { providedIn: 'root' },
  withState<State>({ page: null, content: null, loading: false, saving: false, error: null }),
  withMethods((store, api = inject(ApiService), publicStore = inject(SiteContentStore)) => ({
    async load(page: SitePage): Promise<void> {
      patchState(store, { page, content: null, loading: true, error: null });
      try {
        const content = await firstValueFrom(
          api.get<PageContent>(apiRoutes.siteContentByPage(page)),
        );
        patchState(store, { content, loading: false });
      } catch (error) {
        patchState(store, { loading: false, error: readError(error) });
      }
    },

    async save(content: PageContent): Promise<boolean> {
      const page = store.page();
      if (!page) return false;

      patchState(store, { saving: true, error: null });
      try {
        const saved = await firstValueFrom(
          api.patch<PageContent>(apiRoutes.siteContentByPage(page), { content }),
        );
        patchState(store, { content: saved, saving: false });
        publicStore.invalidate(page);
        return true;
      } catch (error) {
        patchState(store, { saving: false, error: readError(error) });
        return false;
      }
    },
  })),
);
