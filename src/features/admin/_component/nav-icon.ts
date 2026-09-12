/** ---------------------------------------------------------------------------------------------------------------------
 * @file nav-icon.ts
 * @fileOverview the reference's renderIcon(): one ICON_PATHS entry as an inline 24×24 line icon.
 */
import { Component, computed, input } from '@angular/core';

import { ICON_PATHS, IconName } from './admin-nav';

@Component({
  selector: 'zx-nav-icon',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      style="flex-shrink:0;"
    >
      @for (shape of shapes(); track $index) {
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
  `,
})
export class NavIcon {
  readonly name = input.required<IconName>();
  readonly size = input(18);

  protected readonly shapes = computed(
    () =>
      ICON_PATHS[this.name()] as ReadonlyArray<readonly [string, Record<string, string | number>]>,
  );
}
