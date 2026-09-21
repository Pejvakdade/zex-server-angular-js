/** ---------------------------------------------------------------------------------------------------------------------
 * @file blog-slider.ts
 * @fileOverview the homepage's "From the blog" carousel. A track of <zx-blog-card>s slides one *page* at a
 *               time (3 cards on desktop, 2 on tablet, 1 on a phone), with arrows, dots, autoplay that
 *               pauses on hover / focus and is off under prefers-reduced-motion, swipe on touch and ←/→ on
 *               the keyboard. The page count follows the container width through a ResizeObserver.
 */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';

import { BlogCard } from './blog-card';
import { BlogPost } from './blog.model';

const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD_PX = 40;

@Component({
  selector: 'zx-blog-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogCard, RouterLink],
  templateUrl: './blog-slider.html',
  styleUrl: './blog-slider.css',
  host: {
    '(mouseenter)': 'paused.set(true)',
    '(mouseleave)': 'paused.set(false)',
    '(focusin)': 'paused.set(true)',
    '(focusout)': 'paused.set(false)',
    '(keydown.arrowLeft)': 'prev()',
    '(keydown.arrowRight)': 'next()',
  },
})
export class BlogSlider implements AfterViewInit {
  readonly posts = input.required<Array<BlogPost>>();
  readonly heading = input('From the blog');
  readonly subheading = input('Guides, updates and the occasional deep dive from the ZexServer team.');

  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
  private readonly destroyRef = inject(DestroyRef);

  protected readonly routes = appRoutes;
  protected readonly perPage = signal(3);
  protected readonly index = signal(0);
  protected readonly paused = signal(false);

  protected readonly pageCount = computed(() => Math.max(1, Math.ceil(this.posts().length / this.perPage())));
  protected readonly pages = computed(() => Array.from({ length: this.pageCount() }, (_, i) => i));
  /**
   * Each card is 1/perPage of the viewport. The track moves by whole pages, except that the last page is
   * pulled back so it is always full — 5 posts at 3 per page show 1-2-3 then 3-4-5, never 4-5 and a gap.
   */
  protected readonly offset = computed(() => {
    const maxFirst = Math.max(0, this.posts().length - this.perPage());
    const firstCard = Math.min(this.index() * this.perPage(), maxFirst);
    return `translateX(-${(firstCard * 100) / this.perPage()}%)`;
  });
  protected readonly cardWidth = computed(() => `${100 / this.perPage()}%`);

  private touchStartX: number | null = null;

  constructor() {
    // Keep the index valid when the post list or the breakpoint changes.
    effect(() => {
      const last = this.pageCount() - 1;
      if (this.index() > last) this.index.set(last);
    });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
      const timer = setInterval(() => {
        if (!this.paused() && this.pageCount() > 1) this.next();
      }, AUTOPLAY_MS);
      this.destroyRef.onDestroy(() => clearInterval(timer));
    }
  }

  /** Cards per page follow the container, not the window — the section has 64px gutters on desktop. */
  ngAfterViewInit(): void {
    const element = this.viewport().nativeElement;
    const apply = (width: number) => this.perPage.set(width < 640 ? 1 : width < 1024 ? 2 : 3);

    apply(element.clientWidth);
    const observer = new ResizeObserver(([entry]) => apply(entry.contentRect.width));
    observer.observe(element);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  protected goTo(page: number): void {
    const count = this.pageCount();
    this.index.set(((page % count) + count) % count);
  }

  protected next(): void {
    this.goTo(this.index() + 1);
  }

  protected prev(): void {
    this.goTo(this.index() - 1);
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0]?.clientX ?? null;
  }

  protected onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? this.touchStartX) - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    delta < 0 ? this.next() : this.prev();
  }
}
