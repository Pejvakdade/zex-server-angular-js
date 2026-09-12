/** ---------------------------------------------------------------------------------------------------------------------
 * @file confirm-dialog.ts
 * @fileOverview the reference's DELETE CONFIRM box.
 */
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'zx-confirm-dialog',
  template: `
    <div
      (click)="cancel.emit()"
      style="position:fixed;inset:0;background:rgba(10,10,30,0.45);display:flex;align-items:center;justify-content:center;z-index:110;padding:20px;"
    >
      <div
        (click)="$event.stopPropagation()"
        style="background:#fff;border-radius:16px;padding:26px;max-width:400px;width:100%;box-shadow:0 24px 60px rgba(20,10,60,0.28);"
      >
        <div style="font-weight:800;font-size:16px;margin-bottom:8px;color:#161629;">
          {{ verb() }} &ldquo;{{ label() }}&rdquo;?
        </div>
        <p style="margin:0 0 20px;font-size:13.5px;color:#5B5E80;">{{ note() }}</p>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button
            type="button"
            (click)="cancel.emit()"
            style="padding:9px 16px;border-radius:10px;border:none;background:transparent;color:#5B5E80;font-weight:600;font-size:13px;cursor:pointer;"
          >
            Cancel
          </button>
          <button
            type="button"
            (click)="confirm.emit()"
            [disabled]="busy()"
            style="padding:9px 18px;border-radius:10px;border:none;background:#DC2626;color:#fff;font-weight:700;font-size:13px;cursor:pointer;"
          >
            {{ verb() }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialog {
  readonly label = input.required<string>();
  readonly verb = input('Delete');
  readonly note = input("This can't be undone.");
  readonly busy = input(false);

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
