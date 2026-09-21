/** ---------------------------------------------------------------------------------------------------------------------
 * @file blog-posts.ts
 * @fileOverview Admin → Blog: every post (drafts included) as a table with status chips and a search,
 *               "New post" and each row's Edit leading to the full-page editor, Delete confirming first.
 *               The list lives in AdminBlogStore (paged), so it survives a round trip through the editor.
 */
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { BLOG_STATUSES, BlogPost, formatDate, statusTint } from '@src/shared/components/blog/blog.model';
import { AdminBlogStore } from '@src/store/admin/admin-blog.store';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';

import { ConfirmDialog } from '../_component/confirm-dialog';
import { DataTable } from '../_component/data-table';
import { Pager } from '../_component/pager';
import { Row, UI } from '../_component/admin-ui';

@Component({
  selector: 'zx-admin-blog-posts',
  imports: [DataTable, ConfirmDialog, Pager, RouterLink],
  templateUrl: './blog-posts.html',
})
export class BlogPosts {
  protected readonly store = inject(AdminBlogStore);
  private readonly toast = inject(AdminToastStore);
  private readonly router = inject(Router);

  protected readonly ui = UI;
  protected readonly routes = appRoutes;
  protected readonly statuses = BLOG_STATUSES;
  protected readonly columns = ['Title', 'Status', 'Tags', 'Author', 'Published', 'Updated'];

  protected readonly rows = computed<Array<Row<BlogPost>>>(() =>
    this.store.page().docs.map((post) => ({
      id: post._id,
      label: post.title,
      data: post,
      cells: [
        { text: post.featured ? `★ ${post.title}` : post.title },
        { text: post.status, tint: statusTint(post.status) },
        { text: post.tags.length ? post.tags.join(', ') : '—' },
        { text: post.authorName },
        { text: formatDate(post.publishedAt) },
        { text: formatDate(post.updatedAt) },
      ],
    })),
  );

  protected readonly deleting = signal<Row<BlogPost> | null>(null);

  constructor() {
    void this.store.load(this.store.page().page || 1);
  }

  protected setStatus(status: string | null): void {
    this.store.setFilter('status', status);
    void this.store.load(1);
  }

  protected onSearch(event: Event): void {
    this.store.setFilter('search', (event.target as HTMLInputElement).value || null);
    void this.store.load(1);
  }

  protected openEdit(row: Row): void {
    void this.router.navigateByUrl(appRoutes.AdminBlogEdit(row.id));
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleting();
    if (!row) return;
    if (await this.store.remove(row.id)) {
      this.deleting.set(null);
      this.toast.flash('Post deleted');
    }
  }
}
