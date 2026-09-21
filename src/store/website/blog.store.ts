/** ---------------------------------------------------------------------------------------------------------------------
 * @file blog.store.ts
 * @fileOverview public blog state: the paginated list with its tag / search filters, the tag chips, the
 *               homepage slider's posts and the post currently open by slug.
 */
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';
import { BlogPost } from '@src/shared/components/blog/blog.model';
import { Paginated } from '@src/store/admin/admin-users.store';
import { emptyPage } from '@src/store/admin/_paged.feature';

const PAGE_SIZE = 9;

type BlogState = {
  page: Paginated<BlogPost>;
  tag: string | null;
  search: string;
  tags: Array<string>;
  home: Array<BlogPost>;
  homeLoaded: boolean;
  post: BlogPost | null;
  loading: boolean;
  postLoading: boolean;
  /** True once a slug lookup came back 404 — the post page shows its "not found" state. */
  postMissing: boolean;
  error: string | null;
};

export const BlogStore = signalStore(
  { providedIn: 'root' },
  withState<BlogState>({
    page: emptyPage<BlogPost>(),
    tag: null,
    search: '',
    tags: [],
    home: [],
    homeLoaded: false,
    post: null,
    loading: false,
    postLoading: false,
    postMissing: false,
    error: null,
  }),
  withComputed(({ page }) => ({
    posts: computed(() => page().docs),
  })),
  withMethods((store, api = inject(ApiService)) => {
    const load = async (pageNumber = 1): Promise<void> => {
      patchState(store, { loading: true, error: null });
      const params = new URLSearchParams({ page: String(pageNumber), limit: String(PAGE_SIZE) });
      if (store.tag()) params.set('tag', store.tag()!);
      if (store.search().trim()) params.set('search', store.search().trim());

      try {
        const page = await firstValueFrom(
          api.get<Paginated<BlogPost>>(`${apiRoutes.blog}?${params.toString()}`),
        );
        patchState(store, { page, loading: false });
      } catch (error) {
        patchState(store, { loading: false, error: readError(error) });
      }
    };

    return {
      load,
      async loadTags(): Promise<void> {
        try {
          const tags = await firstValueFrom(api.get<Array<string>>(apiRoutes.blogTags));
          patchState(store, { tags });
        } catch {
          patchState(store, { tags: [] });
        }
      },
      /** The slider's posts; loaded once per session — the home page is visited often. */
      async loadHome(): Promise<void> {
        if (store.homeLoaded()) return;
        try {
          const home = await firstValueFrom(api.get<Array<BlogPost>>(apiRoutes.blogHome));
          patchState(store, { home, homeLoaded: true });
        } catch {
          patchState(store, { home: [], homeLoaded: true });
        }
      },
      async loadPost(slug: string): Promise<void> {
        // Serve the open post instantly when the visitor came from a card that already had it.
        const known = [...store.page().docs, ...store.home()].find((p) => p.slug === slug) ?? null;
        patchState(store, { post: known, postLoading: true, postMissing: false });

        try {
          const post = await firstValueFrom(api.get<BlogPost>(apiRoutes.blogBySlug(slug)));
          patchState(store, { post, postLoading: false });
        } catch {
          patchState(store, { post: null, postLoading: false, postMissing: true });
        }
      },
      setTag: (tag: string | null) => patchState(store, { tag }),
      setSearch: (search: string) => patchState(store, { search }),
      /** Drops the cached slider list — called after the dashboard publishes, so a staff member sees their post at once. */
      invalidateHome: () => patchState(store, { home: [], homeLoaded: false }),
    };
  }),
);
