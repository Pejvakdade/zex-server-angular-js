/** ---------------------------------------------------------------------------------------------------------------------
 * @file blog-editor.ts
 * @fileOverview the full-page post editor behind /admin/blog/new and /admin/blog/:id. Left: title, slug
 *               (follows the title until it is edited by hand), excerpt, the Markdown body with its toolbar
 *               and a live preview; right: status, featured, tags and the cover. "Save" keeps the current
 *               status, "Publish" / "Unpublish" flip it. Leaving with unsaved edits asks first.
 */
import { Component, HostListener, computed, effect, inject, input, signal, viewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { renderMarkdown } from '@src/lib/markdown';
import { BlogPost, BlogStatus, formatDate } from '@src/shared/components/blog/blog.model';
import { AdminBlogStore, BlogPostDraft } from '@src/store/admin/admin-blog.store';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';

import { MarkdownAction, MarkdownToolbar, applyAction } from '../_component/markdown-toolbar';
import { UI } from '../_component/admin-ui';
import { CoverUpload } from './cover-upload';

/** Same rule as the backend's `slugify`, so the preview under the field matches what will be stored. */
export const slugify = (text: string): string =>
  text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);

const EMPTY: BlogPostDraft = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  coverImage: null,
  tags: [],
  status: 'Draft',
  featured: false,
};

@Component({
  selector: 'zx-admin-blog-editor',
  imports: [FormsModule, RouterLink, MarkdownToolbar, CoverUpload],
  templateUrl: './blog-editor.html',
  styleUrl: './blog-editor.css',
})
export class BlogEditor {
  /** Route param; undefined on /admin/blog/new. */
  readonly id = input<string>();

  protected readonly store = inject(AdminBlogStore);
  private readonly toast = inject(AdminToastStore);
  private readonly router = inject(Router);
  private readonly bodyArea = viewChild<ElementRef<HTMLTextAreaElement>>('bodyArea');

  protected readonly ui = UI;
  protected readonly routes = appRoutes;
  protected readonly formatDate = formatDate;

  protected readonly draft = signal<BlogPostDraft>({ ...EMPTY });
  /** The last saved shape, to know whether there is anything to lose. */
  private readonly saved = signal<BlogPostDraft>({ ...EMPTY });
  protected readonly slugTouched = signal(false);
  protected readonly tagInput = signal('');
  protected readonly view = signal<'write' | 'preview' | 'split'>('split');

  protected readonly isNew = computed(() => !this.id());
  protected readonly current = computed<BlogPost | null>(() => (this.isNew() ? null : this.store.current()));
  protected readonly dirty = computed(() => JSON.stringify(this.draft()) !== JSON.stringify(this.saved()));
  protected readonly preview = computed(() => renderMarkdown(this.draft().body));
  protected readonly words = computed(() => this.draft().body.trim().split(/\s+/).filter(Boolean).length);
  protected readonly canSave = computed(() => this.draft().title.trim().length >= 3 && !this.store.saving());
  protected readonly publicUrl = computed(() => {
    const post = this.current();
    return post && post.status === 'Published' ? appRoutes.BlogPost(post.slug) : null;
  });

  constructor() {
    // Load (or reset) whenever the route id changes.
    effect(() => {
      const id = this.id();
      if (id) void this.store.loadOne(id);
      else {
        this.store.clearCurrent();
        this.seed({ ...EMPTY });
      }
    });

    // Seed the form from the loaded post.
    effect(() => {
      const post = this.store.current();
      if (post && post._id === this.id()) this.seed(toDraft(post));
    });
  }

  private seed(draft: BlogPostDraft): void {
    this.draft.set(draft);
    this.saved.set(structuredClone(draft));
    this.slugTouched.set(!!draft.slug);
  }

  @HostListener('window:beforeunload', ['$event'])
  protected onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.dirty()) event.preventDefault();
  }

  /** Used by the Back link and the route guard: true when it is fine to leave. */
  canLeave(): boolean {
    return !this.dirty() || confirm('You have unsaved changes. Leave without saving?');
  }

  // ---- field handlers -----------------------------------------------------------------------------------------------

  protected patch<K extends keyof BlogPostDraft>(key: K, value: BlogPostDraft[K]): void {
    this.draft.update((d) => ({ ...d, [key]: value }));
  }

  protected onTitle(value: string): void {
    this.patch('title', value);
    if (!this.slugTouched()) this.patch('slug', slugify(value));
  }

  protected onSlug(value: string): void {
    this.slugTouched.set(true);
    this.patch('slug', slugify(value));
  }

  protected resetSlug(): void {
    this.slugTouched.set(false);
    this.patch('slug', slugify(this.draft().title));
  }

  /** Adds what is in the box; a pasted "a, b" becomes two tags. Duplicates (any case) are dropped. */
  protected addTag(raw = this.tagInput()): void {
    this.tagInput.set('');
    const tags = [...this.draft().tags];
    for (const piece of raw.split(',')) {
      const tag = piece.trim().slice(0, 40);
      if (!tag || tags.length >= 10) continue;
      if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) continue;
      tags.push(tag);
    }
    if (tags.length !== this.draft().tags.length) this.patch('tags', tags);
  }

  protected onTagKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    } else if (event.key === 'Backspace' && !this.tagInput() && this.draft().tags.length) {
      this.patch('tags', this.draft().tags.slice(0, -1));
    }
  }

  protected removeTag(tag: string): void {
    this.patch('tags', this.draft().tags.filter((t) => t !== tag));
  }

  protected onToolbar(action: MarkdownAction): void {
    const area = this.bodyArea()?.nativeElement;
    if (!area) return;
    const edit = applyAction(action, this.draft().body, area.selectionStart, area.selectionEnd);
    this.patch('body', edit.text);
    // Restore the caret after Angular has written the new value back.
    setTimeout(() => {
      area.focus();
      area.setSelectionRange(edit.selectionStart, edit.selectionEnd);
    });
  }

  /** Tab inserts two spaces instead of leaving the textarea. */
  protected onBodyKey(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    const area = event.target as HTMLTextAreaElement;
    const { selectionStart, selectionEnd, value } = area;
    this.patch('body', `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`);
    setTimeout(() => area.setSelectionRange(selectionStart + 2, selectionStart + 2));
  }

  // ---- saving -------------------------------------------------------------------------------------------------------

  protected async save(status: BlogStatus = this.draft().status): Promise<void> {
    if (!this.canSave()) return;
    this.addTag(); // a tag left half-typed in the box still counts

    const body: BlogPostDraft = { ...this.draft(), status, title: this.draft().title.trim() };
    const id = this.id();
    const saved = id ? await this.store.update(id, body) : await this.store.create(body);
    if (!saved) return;

    this.seed(toDraft(saved));
    this.toast.flash(
      status === 'Published' && body.status !== this.saved().status
        ? 'Post published'
        : status === 'Published'
          ? 'Post saved'
          : id
            ? 'Draft saved'
            : 'Draft created',
    );

    // A brand-new post now has an id: move to its edit URL so a refresh keeps working.
    if (!id) void this.router.navigateByUrl(appRoutes.AdminBlogEdit(saved._id), { replaceUrl: true });
  }

  protected async back(): Promise<void> {
    if (this.canLeave()) await this.router.navigateByUrl(appRoutes.AdminBlog);
  }
}

const toDraft = (post: BlogPost): BlogPostDraft => ({
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  body: post.body,
  coverImage: post.coverImage,
  tags: [...post.tags],
  status: post.status,
  featured: post.featured,
});
