/** ---------------------------------------------------------------------------------------------------------------------
 * @file data-table.ts
 * @fileOverview the reference's GENERIC LIST SECTION table: header row, one row per entity with its
 *               cells (optionally as status pills) and the Edit / Delete buttons.
 */
import { Component, input, output } from '@angular/core';

import { Row, UI, pill } from './admin-ui';

@Component({
  selector: 'zx-data-table',
  template: `
    <div style="overflow-x:auto;">
      <table style="border-collapse:collapse;width:100%;">
        <thead>
          <tr>
            @for (col of columns(); track col) {
              <th [style]="ui.thead">{{ col }}</th>
            }
            <th style="border-bottom:1px solid #EEF0FA;"></th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.id) {
            <tr class="row">
              @for (cell of row.cells; track $index) {
                <td [style]="ui.td">
                  <span [style]="cell.tint ? pill(cell.tint) : ''">{{ cell.text }}</span>
                </td>
              }
              <td
                style="padding:14px;border-bottom:1px solid #F3F4FC;text-align:right;white-space:nowrap;"
              >
                <button type="button" (click)="edit.emit(row)" [style]="ui.editBtn">
                  {{ editLabel() }}
                </button>
                @if (!row.noDelete) {
                  <button type="button" (click)="remove.emit(row)" [style]="ui.deleteBtn">
                    Delete
                  </button>
                }
              </td>
            </tr>
          } @empty {
            <tr>
              <td
                [attr.colspan]="columns().length + 1"
                [style]="ui.tdMuted"
                style="text-align:center;padding:32px;"
              >
                {{ loading() ? 'Loading…' : emptyText() }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .row:hover {
      background: #f9faff;
    }
  `,
})
export class DataTable {
  readonly columns = input.required<ReadonlyArray<string>>();
  readonly rows = input.required<Array<Row>>();
  readonly loading = input(false);
  readonly emptyText = input('Nothing here yet.');
  readonly editLabel = input('Edit');

  readonly edit = output<Row>();
  readonly remove = output<Row>();

  protected readonly ui = UI;
  protected readonly pill = pill;
}
