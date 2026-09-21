/** ---------------------------------------------------------------------------------------------------------------------
 * @file line-icon.ts
 * @fileOverview renders a content emoji as a 24×24 stroke icon — the reference's ZX_renderIcon(). An emoji
 *               without a glyph in line-icons.ts is printed as-is, so a new icon typed in the admin editor
 *               still shows something rather than a hole.
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { lookupIcon } from './line-icons';

@Component({
  selector: 'zx-line-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (shapes(); as shapes) {
      <svg
        [attr.width]="size()"
        [attr.height]="size()"
        viewBox="0 0 24 24"
        fill="none"
        [attr.stroke]="color()"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="display:block;flex-shrink:0;"
        aria-hidden="true"
      >
        @for (shape of shapes; track $index) {
          @switch (shape[0]) {
            @case ('rect') {
              <rect
                [attr.x]="shape[1]['x']"
                [attr.y]="shape[1]['y']"
                [attr.width]="shape[1]['width']"
                [attr.height]="shape[1]['height']"
                [attr.rx]="shape[1]['rx']"
              />
            }
            @case ('circle') {
              <circle
                [attr.cx]="shape[1]['cx']"
                [attr.cy]="shape[1]['cy']"
                [attr.r]="shape[1]['r']"
              />
            }
            @case ('ellipse') {
              <ellipse
                [attr.cx]="shape[1]['cx']"
                [attr.cy]="shape[1]['cy']"
                [attr.rx]="shape[1]['rx']"
                [attr.ry]="shape[1]['ry']"
              />
            }
            @case ('line') {
              <line
                [attr.x1]="shape[1]['x1']"
                [attr.y1]="shape[1]['y1']"
                [attr.x2]="shape[1]['x2']"
                [attr.y2]="shape[1]['y2']"
              />
            }
            @case ('path') {
              <path [attr.d]="shape[1]['d']" />
            }
          }
        }
      </svg>
    } @else {
      <span [style.font-size.px]="size()" style="line-height:1;display:block;">{{ icon() }}</span>
    }
  `,
  host: { style: 'display:inline-flex;flex-shrink:0;' },
})
export class LineIcon {
  readonly icon = input.required<string>();
  readonly size = input(26);
  readonly color = input('#1269E8');

  protected readonly shapes = computed(() => lookupIcon(this.icon()));
}
