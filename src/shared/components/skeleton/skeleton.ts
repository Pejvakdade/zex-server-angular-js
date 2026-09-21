/** ---------------------------------------------------------------------------------------------------------------------
 * @file skeleton.ts
 * @fileOverview loading placeholders for the public pages. Each `kind` is sized to the real section it
 *               stands in for (hero = var(--zx-hero-height), feature strip 147px, …) so the content landing doesn't jump.
 *               The pulse itself is the global `.zx-skeleton` class in styles.css.
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SkeletonKind = 'hero' | 'strip' | 'cards' | 'article' | 'stats';

@Component({
  selector: 'zx-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-busy': 'true', style: 'display:block' },
  template: `
    @switch (kind()) {
      @case ('hero') {
        <section
          style="
            background: linear-gradient(120deg, var(--zx-hero-wash-1) 0%, var(--zx-surface-active-2) 60%, var(--zx-hero-wash-2) 100%);
            padding: 64px;
            min-height: var(--zx-hero-height);
            display: flex;
            align-items: center;
            box-sizing: border-box;
          "
        >
          <div style="max-width: 1520px; margin: 0 auto; width: 100%">
            <div
              class="zx-skeleton"
              style="width: 150px; height: 27px; border-radius: 20px; margin-bottom: 16px"
            ></div>
            <div
              class="zx-skeleton"
              style="width: min(720px, 80%); height: 52px; margin-bottom: 14px"
            ></div>
            <div
              class="zx-skeleton"
              style="width: min(520px, 60%); height: 52px; margin-bottom: 28px"
            ></div>
            <div
              class="zx-skeleton"
              style="width: min(560px, 70%); height: 18px; margin-bottom: 10px"
            ></div>
            <div
              class="zx-skeleton"
              style="width: min(380px, 50%); height: 18px; margin-bottom: 27px"
            ></div>
            <div style="display: flex; gap: 14px">
              <div
                class="zx-skeleton"
                style="width: 150px; height: 50px; border-radius: 10px"
              ></div>
              <div
                class="zx-skeleton"
                style="width: 170px; height: 50px; border-radius: 10px"
              ></div>
            </div>
          </div>
        </section>
      }

      @case ('strip') {
        <section style="padding: 0 64px; margin-top: -6px">
          <div
            style="
              max-width: 1520px;
              margin: 0 auto;
              min-height: 147px;
              box-sizing: border-box;
              background: var(--zx-bg);
              border: 1px solid var(--zx-border-soft);
              border-radius: 18px;
              box-shadow: 0 10px 32px rgba(30, 20, 90, 0.06);
              padding: 22px 30px;
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px 24px;
              align-items: center;
            "
          >
            @for (i of items(); track i) {
              <div style="display: flex; align-items: center; gap: 13px">
                <div
                  class="zx-skeleton"
                  style="width: 30px; height: 30px; border-radius: 8px"
                ></div>
                <div style="flex: 1">
                  <div
                    class="zx-skeleton"
                    style="width: 70%; height: 14px; margin-bottom: 8px"
                  ></div>
                  <div class="zx-skeleton" style="width: 50%; height: 12px"></div>
                </div>
              </div>
            }
          </div>
        </section>
      }

      @case ('cards') {
        <section [style.padding]="heading() ? '64px 64px 10px' : '0 64px 10px'">
          <div style="max-width: 1520px; margin: 0 auto">
            @if (heading()) {
              <div
                class="zx-skeleton"
                style="width: min(420px, 60%); height: 36px; margin: 0 auto 12px"
              ></div>
              <div
                class="zx-skeleton"
                style="width: min(560px, 80%); height: 16px; margin: 0 auto 40px"
              ></div>
            }
            <div
              style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
              "
            >
              @for (i of items(); track i) {
                <div
                  style="
                    background: var(--zx-bg);
                    border: 1px solid var(--zx-border-soft);
                    border-radius: 18px;
                    padding: 28px;
                    min-height: 220px;
                    box-sizing: border-box;
                  "
                >
                  <div
                    class="zx-skeleton"
                    style="width: 46px; height: 46px; border-radius: 12px; margin-bottom: 20px"
                  ></div>
                  <div
                    class="zx-skeleton"
                    style="width: 60%; height: 20px; margin-bottom: 12px"
                  ></div>
                  <div
                    class="zx-skeleton"
                    style="width: 100%; height: 14px; margin-bottom: 8px"
                  ></div>
                  <div
                    class="zx-skeleton"
                    style="width: 85%; height: 14px; margin-bottom: 8px"
                  ></div>
                  <div class="zx-skeleton" style="width: 40%; height: 14px"></div>
                </div>
              }
            </div>
          </div>
        </section>
      }

      @case ('article') {
        <section style="padding: 64px 24px 80px">
          <div style="max-width: 760px; margin: 0 auto">
            <div
              class="zx-skeleton"
              style="width: 90px; height: 27px; border-radius: 20px; margin-bottom: 20px"
            ></div>
            <div class="zx-skeleton" style="width: 70%; height: 42px; margin-bottom: 14px"></div>
            <div class="zx-skeleton" style="width: 160px; height: 14px; margin-bottom: 40px"></div>
            <div style="display: flex; flex-direction: column; gap: 22px">
              @for (i of items(); track i) {
                <div>
                  <div
                    class="zx-skeleton"
                    style="width: 45%; height: 18px; margin-bottom: 10px"
                  ></div>
                  <div
                    class="zx-skeleton"
                    style="width: 100%; height: 14px; margin-bottom: 7px"
                  ></div>
                  <div
                    class="zx-skeleton"
                    style="width: 96%; height: 14px; margin-bottom: 7px"
                  ></div>
                  <div class="zx-skeleton" style="width: 70%; height: 14px"></div>
                </div>
              }
            </div>
          </div>
        </section>
      }

      @case ('stats') {
        <!-- sits on the dark "Fleet Overview" panel, so the pulse is translucent white -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px">
          @for (i of items(); track i) {
            <div style="background: rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 10px">
              <div
                class="zx-skeleton"
                style="width: 55%; height: 11px; margin-bottom: 8px; background: rgba(255, 255, 255, 0.18)"
              ></div>
              <div
                class="zx-skeleton"
                style="width: 70%; height: 20px; background: rgba(255, 255, 255, 0.25)"
              ></div>
            </div>
          }
        </div>
      }
    }
  `,
})
export class Skeleton {
  readonly kind = input.required<SkeletonKind>();
  /** how many repeated blocks (strip items, cards, paragraphs, stat tiles) to draw */
  readonly count = input<number | undefined>(undefined);
  /** `cards` only: draw the section title/subtitle placeholders above the grid */
  readonly heading = input(true);

  private static readonly DEFAULT_COUNT: Record<SkeletonKind, number> = {
    hero: 0,
    strip: 5,
    cards: 3,
    article: 6,
    stats: 3,
  };

  protected readonly items = computed(() =>
    Array.from({ length: this.count() ?? Skeleton.DEFAULT_COUNT[this.kind()] }, (_, i) => i),
  );
}
