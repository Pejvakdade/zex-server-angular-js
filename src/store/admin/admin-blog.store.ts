/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-blog.store.ts
 * @fileOverview every post (drafts included) for the dashboard table, plus the single post the editor is
 *               working on. Writes go through `_paged.feature`'s `write` so the table refreshes itself.
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';
import { BlogPost, BlogStatus } from '@src/shared/components/blog/blog.model';
import { BlogStore } from '@src/store/website/blog.store';

import { withPaged } from './_paged.feature';

/** What the editor sends; the server owns `slug` uniqueness, `readingMinutes`, `publishedAt` and the author. */
export type BlogPostDraft = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  tags: Array<string>;
  status: BlogStatus;
  featured: boolean;
};

export const AdminBlogStore = signalStore(
  { providedIn: 'root' },
  withPaged<BlogPost, { status: string | null; search: string | null }>(apiRoutes.blogAdmin, {
    status: null,
    search: null,
  }),
  withState<{ current: BlogPost | null; currentLoading: boolean }>({
    current: null,
    currentLoading: false,
  }),
  withMethods((store, api = inject(ApiService), publicBlog = inject(BlogStore)) => {
    /** Public caches on the site side are in this same SPA, so a write here must drop them too. */
    const afterWrite = (): void => publicBlog.invalidateHome();

    return {
      async loadOne(id: string): Promise<void> {
        patchState(store, { current: null, currentLoading: true, error: null });
        try {
          const current = await firstValueFrom(api.get<BlogPost>(apiRoutes.blogAdminById(id)));
          patchState(store, { current, currentLoading: false });
        } catch (error) {
          patchState(store, { currentLoading: false, error: readError(error) });
        }
      },
      clearCurrent: () => patchState(store, { current: null }),

      /** Resolves to the saved post (so the editor can move from /new to /:id) or null on failure. */
      async create(draft: BlogPostDraft): Promise<BlogPost | null> {
        let saved: BlogPost | null = null;
        const ok = await store.write(async () => {
          saved = await firstValueFrom(api.post<BlogPost>(apiRoutes.blog, draft));
        });
        if (ok) {
          afterWrite();
          patchState(store, { current: saved });
        }
        return ok ? saved : null;
      },
      async update(id: string, draft: Partial<BlogPostDraft>): Promise<BlogPost | null> {
        let saved: BlogPost | null = null;
        const ok = await store.write(async () => {
          saved = await firstValueFrom(api.patch<BlogPost>(apiRoutes.blogById(id), draft));
        });
        if (ok) {
          afterWrite();
          patchState(store, { current: saved });
        }
        return ok ? saved : null;
      },
      async remove(id: string): Promise<boolean> {
        const ok = await store.write(() => firstValueFrom(api.delete(apiRoutes.blogById(id))));
        if (ok) afterWrite();
        return ok;
      },
    };
  }),
);
