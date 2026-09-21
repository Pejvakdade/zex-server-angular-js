/** ---------------------------------------------------------------------------------------------------------------------
 * @file image-upload.ts
 * @fileOverview the `image` field of the page editors: a hero banner slot. Shows the current banner (or an
 *               empty frame), states the required size, and checks the picked file's pixel size in the browser
 *               before anything is sent — a wrong-size file never leaves the machine. The accepted file goes to
 *               POST /upload/banner and the returned URL becomes the field's value.
 */
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { assetUrl } from '@src/lib/assetUrl';
import { readError } from '@src/lib/readError';

import { BANNER_HEIGHT, BANNER_HINT, BANNER_MAX_BYTES, BANNER_WIDTH, BRAND_MAX_BYTES, UI, UploadKind } from './admin-ui';

interface UploadedBanner {
  url: string;
  width: number;
  height: number;
}

@Component({
  selector: 'zx-image-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:block' },
  template: `
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: 10px;
        border: 1.5px dashed var(--zx-border);
        border-radius: 12px;
        padding: 14px;
        background: var(--zx-bg-tint);
      "
    >
      <!-- preview keeps the banner's own 1920:560 ratio so the editor sees exactly what the hero crops to -->
      @if (value()) {
        <img
          [src]="previewUrl()"
          alt="Hero banner preview"
          style="
            width: 100%;
            aspect-ratio: ${BANNER_WIDTH} / ${BANNER_HEIGHT};
            object-fit: cover;
            border-radius: 8px;
            display: block;
            background: var(--zx-skeleton);
          "
        />
      } @else {
        <div
          style="
            width: 100%;
            aspect-ratio: ${BANNER_WIDTH} / ${BANNER_HEIGHT};
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--zx-bg);
            color: var(--zx-text-faint);
            font-size: 13px;
          "
        >
          No banner yet — the hero shows its gradient only
        </div>
      }

      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap">
        <label [style]="ui.addBtn" style="display: inline-flex; align-items: center; gap: 6px">
          {{ uploading() ? 'Uploading…' : value() ? 'Replace image' : 'Upload image' }}
          <input
            type="file"
            [accept]="accept()"
            [disabled]="uploading()"
            (change)="onPick($event)"
            style="display: none"
          />
        </label>
        @if (value()) {
          <button type="button" [style]="ui.deleteBtn" style="margin-left: 0" (click)="clear()">
            Remove
          </button>
        }
        <span style="font-size: 12.5px; color: var(--zx-text-muted)">{{ hint() }}</span>
      </div>

      @if (error()) {
        <div
          style="
            font-size: 13px;
            color: var(--zx-red-fg);
            background: var(--zx-red-tint);
            border: 1px solid var(--zx-red-border);
            border-radius: 10px;
            padding: 10px 12px;
          "
        >
          {{ error() }}
        </div>
      }
    </div>
  `,
})
export class ImageUpload {
  /** Stored value: the backend-relative URL (`/uploads/banners/…`) or ''. */
  readonly value = input<string>('');
  readonly hint = input<string>(BANNER_HINT);
  /** `banner` enforces the exact hero size client-side; `brand` only checks the byte limit. */
  readonly kind = input<UploadKind>('banner');
  readonly valueChange = output<string>();

  protected readonly accept = computed(() =>
    this.kind() === 'brand'
      ? 'image/jpeg,image/png,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico,.svg'
      : 'image/jpeg,image/png,image/webp',
  );

  private readonly api = inject(ApiService);

  protected readonly ui = UI;
  protected readonly uploading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected previewUrl(): string {
    return assetUrl(this.value());
  }

  protected clear(): void {
    this.error.set(null);
    this.valueChange.emit('');
  }

  protected async onPick(event: Event): Promise<void> {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = ''; // so picking the same file again re-fires `change`
    if (!file) return;

    this.error.set(null);

    const brand = this.kind() === 'brand';
    const maxBytes = brand ? BRAND_MAX_BYTES : BANNER_MAX_BYTES;
    if (file.size > maxBytes) {
      this.error.set(
        `This file is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is ${maxBytes / 1024 / 1024} MB.`,
      );
      return;
    }

    // Brand assets (logo / favicon / share image) have no fixed size, and SVG / ICO cannot be decoded here anyway.
    if (!brand) {
      const size = await readImageSize(file);
      if (!size) {
        this.error.set('That file could not be read as an image. Use a JPG, PNG or WebP.');
        return;
      }
      if (size.width !== BANNER_WIDTH || size.height !== BANNER_HEIGHT) {
        this.error.set(
          `Your image is ${size.width} × ${size.height} px — please upload a ${BANNER_WIDTH} × ${BANNER_HEIGHT} px banner.`,
        );
        return;
      }
    }

    const body = new FormData();
    body.append('file', file, file.name);

    this.uploading.set(true);
    try {
      const uploaded = await firstValueFrom(
        this.api.post<UploadedBanner>(brand ? apiRoutes.uploadBrand : apiRoutes.uploadBanner, body),
      );
      this.valueChange.emit(uploaded.url);
    } catch (e) {
      this.error.set(readError(e));
    } finally {
      this.uploading.set(false);
    }
  }
}

/** Pixel size of an image file via the browser's decoder; `null` when it is not a decodable image. */
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
