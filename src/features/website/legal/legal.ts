/** ---------------------------------------------------------------------------------------------------------------------
 * @file legal.ts
 * @fileOverview Terms of Service and Privacy Policy — one component, the document chosen by the
 *               route's `data.document`. Ported from the reference legal pages.
 */
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import appRoutes from '@src/common/appRoutes';
import { SiteContentStore } from '@src/store/website/site-content.store';

export type LegalDocument = 'terms' | 'privacy';

interface LegalContent {
  termsUpdated: string;
  termsBody: string;
  privacyUpdated: string;
  privacyBody: string;
}

interface Block {
  heading: string | null;
  body: string;
}

@Component({
  selector: 'zx-legal',
  imports: [RouterLink],
  template: `
    <section style="padding:64px 24px 80px;font-family:var(--zx-font);">
      <div style="max-width:760px;margin:0 auto;">
        <div
          style="display:inline-flex;align-items:center;gap:6px;background:#EEF0FE;color:#1269E8;font-weight:700;font-size:12.5px;padding:6px 14px;border-radius:20px;margin-bottom:20px;"
        >
          &#9679; LEGAL
        </div>
        <h1
          style="font-size:38px;font-weight:800;color:#161629;margin:0 0 10px;letter-spacing:-0.3px;"
        >
          {{ title() }}
        </h1>

        @if (lastUpdated()) {
          <div style="font-size:13.5px;color:#8386AC;margin-bottom:40px;">
            Last updated: {{ lastUpdated() }}
          </div>
        }

        <div style="display:flex;flex-direction:column;gap:22px;">
          @for (block of blocks(); track $index) {
            <div>
              @if (block.heading) {
                <h3 style="font-size:17px;font-weight:700;color:#161629;margin:0 0 8px;">
                  {{ block.heading }}
                </h3>
              }
              <p style="font-size:15px;color:#3A3D5C;line-height:1.7;margin:0;">{{ block.body }}</p>
            </div>
          } @empty {
            <p style="font-size:15px;color:#8386AC;">This document has not been published yet.</p>
          }
        </div>

        <div
          style="margin-top:48px;padding-top:24px;border-top:1px solid #EEF0FA;font-size:13.5px;color:#8386AC;"
        >
          Questions about this document?
          <a [routerLink]="routes.ContactUs" style="font-weight:700;">Contact us</a>.
        </div>
      </div>
    </section>
  `,
})
export class Legal {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(SiteContentStore);

  protected readonly routes = appRoutes;

  /** Both legal routes share this component, so the document is tracked rather than snapshotted. */
  private readonly document = signal<LegalDocument>(
    this.route.snapshot.data['document'] as LegalDocument,
  );

  private readonly content = computed(() => this.store.forPage()<LegalContent>('legal'));

  protected readonly title = computed(() =>
    this.document() === 'terms' ? 'Terms of Service' : 'Privacy Policy',
  );

  protected readonly lastUpdated = computed(() => {
    const content = this.content();
    if (!content) return '';
    return this.document() === 'terms' ? content.termsUpdated : content.privacyUpdated;
  });

  /**
   * Splits the stored body into blocks exactly as the reference does: paragraphs are separated by a
   * blank line, and a paragraph's first line becomes a heading when it has more than one line.
   */
  protected readonly blocks = computed<Array<Block>>(() => {
    const content = this.content();
    if (!content) return [];

    const body = this.document() === 'terms' ? content.termsBody : content.privacyBody;

    return (body || '')
      .split('\n\n')
      .filter((block) => block.trim())
      .map((block) => {
        const lines = block.split('\n');
        return lines.length > 1
          ? { heading: lines[0], body: lines.slice(1).join(' ') }
          : { heading: null, body: lines[0] };
      });
  });

  constructor() {
    this.route.data
      .pipe(takeUntilDestroyed())
      .subscribe((data) => this.document.set(data['document'] as LegalDocument));

    void this.store.load('legal');
  }
}
