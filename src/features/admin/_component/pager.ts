/** ---------------------------------------------------------------------------------------------------------------------
 * @file pager.ts
 * @fileOverview Previous / Page x of y / Next, the strip every paginated section shows under its table.
 *               Renders nothing when there is a single page.
 */
import { Component, input, output } from '@angular/core';

import { Paginated } from '@src/store/admin/admin-users.store';

import { UI } from './admin-ui';

@Component({
  selector: 'zx-pager',
  template: `
    @if (page().totalPages > 1) {
      <div
        style="display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-top:16px;font-size:13px;color:#5B5E80;"
      >
        <button
          type="button"
          [disabled]="page().page <= 1"
          (click)="goTo.emit(page().page - 1)"
          [style]="ui.viewBtn"
        >
          Previous
        </button>
        <span>Page {{ page().page }} of {{ page().totalPages }}</span>
        <button
          type="button"
          [disabled]="page().page >= page().totalPages"
          (click)="goTo.emit(page().page + 1)"
          [style]="ui.viewBtn"
        >
          Next
        </button>
      </div>
    }
  `,
})
export class Pager {
  readonly page = input.required<Paginated<unknown>>();
  readonly goTo = output<number>();

  protected readonly ui = UI;
}
