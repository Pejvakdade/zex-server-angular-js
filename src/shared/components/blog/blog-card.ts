/** ---------------------------------------------------------------------------------------------------------------------
 * @file blog-card.ts
 * @fileOverview one post as a card: cover (or a gradient placeholder), tags, title, excerpt and the
 *               author · date · read-time line. Used by the Blog list and the homepage slider.
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { assetUrl } from '@src/lib/assetUrl';

import { BlogPost, formatDate } from './blog.model';

@Component({
  selector: 'zx-blog-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.css',
})
export class BlogCard {
  readonly post = input.required<BlogPost>();

  protected readonly link = computed(() => appRoutes.BlogPost(this.post().slug));
  protected readonly cover = computed(() => assetUrl(this.post().coverImage));
  protected readonly date = computed(() => formatDate(this.post().publishedAt));
  /** Two tags at most on a card; the post page shows them all. */
  protected readonly tags = computed(() => this.post().tags.slice(0, 2));
}
