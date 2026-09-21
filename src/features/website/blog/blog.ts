/** ---------------------------------------------------------------------------------------------------------------------
 * @file blog.ts
 * @fileOverview the public Blog page: every published post as a card grid, filterable by tag and by a
 *               title / excerpt search, paginated. There is no reference page for it; it borrows the
 *               Locations page's heading block and the site's card look (see zx-blog-card).
 */
import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { BlogCard } from '@src/shared/components/blog/blog-card';
import { BlogStore } from '@src/store/website/blog.store';

@Component({
  selector: 'zx-blog',
  imports: [BlogCard],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  protected readonly store = inject(BlogStore);
  private readonly title = inject(Title);

  /** Skeleton slots while the first page loads. */
  protected readonly placeholders = [0, 1, 2, 3, 4, 5];
  protected readonly searchDraft = signal(this.store.search());

  constructor() {
    this.title.setTitle('Blog — ZexServer');
    void this.store.load(this.store.page().page || 1);
    void this.store.loadTags();
  }

  protected pickTag(tag: string | null): void {
    this.store.setTag(this.store.tag() === tag ? null : tag);
    void this.store.load(1);
  }

  protected submitSearch(event: Event): void {
    event.preventDefault();
    this.store.setSearch(this.searchDraft());
    void this.store.load(1);
  }

  protected clearSearch(): void {
    this.searchDraft.set('');
    this.store.setSearch('');
    void this.store.load(1);
  }

  protected goTo(page: number): void {
    void this.store.load(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected onSearchInput(event: Event): void {
    this.searchDraft.set((event.target as HTMLInputElement).value);
  }
}
