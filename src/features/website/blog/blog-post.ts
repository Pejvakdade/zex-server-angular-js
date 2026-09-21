/** ---------------------------------------------------------------------------------------------------------------------
 * @file blog-post.ts
 * @fileOverview one article at /blog/:slug — cover, title, meta line, the Markdown body rendered through
 *               `renderMarkdown` (sanitised, so `[innerHTML]` is safe), its tags, and three more posts.
 *               A draft or unknown slug shows a "not found" state rather than an empty page.
 */
import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { assetUrl } from '@src/lib/assetUrl';
import { renderMarkdown } from '@src/lib/markdown';
import { BlogCard } from '@src/shared/components/blog/blog-card';
import { formatDate } from '@src/shared/components/blog/blog.model';
import { BlogStore } from '@src/store/website/blog.store';

@Component({
  selector: 'zx-blog-post',
  imports: [RouterLink, BlogCard],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
})
export class BlogPostPage {
  /** Bound from the route by withComponentInputBinding. */
  readonly slug = input.required<string>();

  protected readonly store = inject(BlogStore);
  private readonly title = inject(Title);

  protected readonly routes = appRoutes;
  protected readonly post = this.store.post;
  protected readonly cover = computed(() => assetUrl(this.post()?.coverImage));
  protected readonly date = computed(() => formatDate(this.post()?.publishedAt));
  protected readonly html = computed(() => renderMarkdown(this.post()?.body));
  /** Three other posts from the slider list, which is already loaded on most visits. */
  protected readonly more = computed(() =>
    this.store
      .home()
      .filter((p) => p.slug !== this.slug())
      .slice(0, 3),
  );

  constructor() {
    effect(() => {
      void this.store.loadPost(this.slug());
      window.scrollTo({ top: 0 });
    });
    effect(() => {
      const post = this.post();
      this.title.setTitle(post ? `${post.title} — ZexServer Blog` : 'Blog — ZexServer');
    });
    void this.store.loadHome();
  }
}
