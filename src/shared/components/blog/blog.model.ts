/** ---------------------------------------------------------------------------------------------------------------------
 * @file blog.model.ts
 * @fileOverview the post shape the API hands back (`BlogNamespace.IBlogPostView`) and the small helpers every
 *               blog surface — cards, slider, list, post page, dashboard — shares.
 */
import { Tint } from '@src/features/admin/_component/admin-ui';

export type BlogStatus = 'Draft' | 'Published';

export const BLOG_STATUSES: ReadonlyArray<BlogStatus> = ['Draft', 'Published'];

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** Markdown; render with `renderMarkdown` from @src/lib/markdown. */
  body: string;
  coverImage: string | null;
  tags: Array<string>;
  status: BlogStatus;
  featured: boolean;
  publishedAt: string | null;
  readingMinutes: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

/** "Sep 21, 2026" — `publishedAt` for public surfaces, `updatedAt` as the dashboard's fallback. */
export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const statusTint = (status: BlogStatus): Tint => (status === 'Published' ? 'green' : 'amber');
