/** ---------------------------------------------------------------------------------------------------------------------
 * @file cover-upload.ts
 * @fileOverview the post editor's cover image slot. Unlike the hero banner slot, a cover only has to be *at
 *               least* 1200 × 630 — the cards crop it — so the check is a minimum, and the file goes to
 *               POST /upload/blog-cover. The returned URL becomes the draft's `coverImage`.
 */
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { assetUrl } from '@src/lib/assetUrl';
import { readError } from '@src/lib/readError';

import { UI } from '../_component/admin-ui';

/** Mirrors the backend's BLOG_COVER_* constants. */
const MIN_WIDTH = 1200;
const MIN_HEIGHT = 630;
const MAX_BYTES = 3 * 1024 * 1024;
const HINT = `At least ${MIN_WIDTH} × ${MIN_HEIGHT} px · JPG, PNG or WebP · max 3 MB`;

@Component({
  selector: 'zx-cover-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:block' },
  template: `
    <div
      style="display:flex;flex-direction:column;gap:10px;border:1.5px dashed var(--zx-border);border-radius:12px;padding:12px;background:var(--zx-bg-tint);"
    >
      @if (value()) {
        <img
          [src]="preview()"
          alt="Cover preview"
          style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px;display:block;background:var(--zx-skeleton);"
        />
      } @else {
        <div
          style="width:100%;aspect-ratio:16/9;border-radius:8px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--zx-primary),var(--zx-violet));color:rgba(255,255,255,0.6);font-size:13px;font-weight:600;"
        >
          No cover — cards show this gradient
        </div>
      }

      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <label [style]="ui.viewBtn" style="display:inline-flex;align-items:center;gap:6px;">
          {{ uploading() ? 'Uploading…' : value() ? 'Replace' : 'Upload cover' }}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            [disabled]="uploading()"
            (change)="onPick($event)"
            style="display:none"
          />
        </label>
        @if (value()) {
          <button type="button" [style]="ui.deleteBtn" style="margin-left:0" (click)="clear()">Remove</button>
        }
      </div>
      <span style="font-size:12px;color:var(--zx-text-muted)">${HINT}</span>

      @if (error()) {
        <div
          style="font-size:13px;color:var(--zx-red-fg);background:var(--zx-red-tint);border:1px solid var(--zx-red-border);border-radius:10px;padding:8px 10px;"
        >
          {{ error() }}
        </div>
      }
    </div>
  `,
})
export class CoverUpload {
  readonly value = input<string | null>(null);
  readonly valueChange = output<string | null>();

  private readonly api = inject(ApiService);

  protected readonly ui = UI;
  protected readonly uploading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected preview(): string {
    return assetUrl(this.value());
  }

  protected clear(): void {
    this.error.set(null);
    this.valueChange.emit(null);
  }

  protected async onPick(event: Event): Promise<void> {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = '';
    if (!file) return;

    this.error.set(null);

    if (file.size > MAX_BYTES) {
      this.error.set(`This file is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 3 MB.`);
      return;
    }

    const size = await readImageSize(file);
    if (!size) {
      this.error.set('That file could not be read as an image. Use a JPG, PNG or WebP.');
      return;
    }
    if (size.width < MIN_WIDTH || size.height < MIN_HEIGHT) {
      this.error.set(`Your image is ${size.width} × ${size.height} px — covers must be at least ${MIN_WIDTH} × ${MIN_HEIGHT} px.`);
      return;
    }

    const body = new FormData();
    body.append('file', file, file.name);

    this.uploading.set(true);
    try {
      const uploaded = await firstValueFrom(this.api.post<{ url: string }>(apiRoutes.uploadBlogCover, body));
      this.valueChange.emit(uploaded.url);
    } catch (e) {
      this.error.set(readError(e));
    } finally {
      this.uploading.set(false);
    }
  }
}

const readImageSize = (file: File): Promise<{ width: number; height: number } | null> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    image.src = url;
  });
