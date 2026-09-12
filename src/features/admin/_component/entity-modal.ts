/** ---------------------------------------------------------------------------------------------------------------------
 * @file entity-modal.ts
 * @fileOverview the reference's ADD / EDIT MODAL: a form generated from a field definition list
 *               (`mkField` in the reference), one input per FieldDef, Cancel / Save at the bottom.
 *
 * The draft is a plain object the parent owns; the modal edits a copy and emits it on Save, so a
 * cancelled edit never touches the table's data.
 */
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FieldDef, UI } from './admin-ui';

@Component({
  selector: 'zx-entity-modal',
  imports: [FormsModule],
  template: `
    <div
      (click)="cancel.emit()"
      style="position:fixed;inset:0;background:rgba(10,10,30,0.45);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;"
    >
      <div
        (click)="$event.stopPropagation()"
        style="background:#fff;border-radius:18px;padding:28px;max-width:560px;width:100%;box-shadow:0 24px 60px rgba(20,10,60,0.28);max-height:90vh;display:flex;flex-direction:column;"
      >
        <div style="font-size:18px;font-weight:800;color:#161629;margin-bottom:18px;flex-shrink:0;">
          {{ title() }}
        </div>

        <form
          (ngSubmit)="submit()"
          style="display:flex;flex-direction:column;gap:14px;overflow-y:auto;padding-right:4px;"
        >
          @for (f of fields(); track f.key) {
            <div style="display:flex;flex-direction:column;gap:6px;">
              @if (f.type !== 'checkbox') {
                <label [style]="ui.label">{{ f.label }}</label>
              }
              @switch (f.type) {
                @case ('text') {
                  <input
                    type="text"
                    [name]="f.key"
                    [(ngModel)]="draft[f.key]"
                    [required]="!!f.required"
                    [style]="ui.input"
                  />
                }
                @case ('number') {
                  <input
                    type="number"
                    step="any"
                    [name]="f.key"
                    [(ngModel)]="draft[f.key]"
                    [required]="!!f.required"
                    [style]="ui.input"
                  />
                }
                @case ('textarea') {
                  <textarea
                    rows="3"
                    [name]="f.key"
                    [(ngModel)]="draft[f.key]"
                    [style]="ui.textarea"
                  ></textarea>
                }
                @case ('select') {
                  <select
                    [name]="f.key"
                    [(ngModel)]="draft[f.key]"
                    (ngModelChange)="fieldChange.emit({ key: f.key, value: $event })"
                    [style]="ui.input"
                  >
                    @for (opt of f.options; track opt) {
                      <option [value]="opt">{{ opt }}</option>
                    }
                  </select>
                }
                @case ('checkbox') {
                  <label
                    style="display:flex;align-items:center;gap:8px;font-size:13.5px;color:#3A3D5C;"
                  >
                    <input type="checkbox" [name]="f.key" [(ngModel)]="draft[f.key]" />
                    {{ f.label }}
                  </label>
                }
                @case ('multiselect') {
                  <div style="display:flex;flex-wrap:wrap;gap:8px;">
                    @for (opt of f.options; track opt) {
                      <button
                        type="button"
                        (click)="toggleMulti(f.key, opt)"
                        [style]="hasMulti(f.key, opt) ? ui.chipActive : ui.chip"
                      >
                        {{ opt }}
                      </button>
                    }
                  </div>
                }
              }
            </div>
          }

          @if (error()) {
            <div
              style="font-size:13px;color:#DC2626;background:#FFF6F6;border:1px solid #FBD5D5;border-radius:10px;padding:10px 12px;"
            >
              {{ error() }}
            </div>
          }

          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:8px;flex-shrink:0;">
            <button
              type="button"
              (click)="cancel.emit()"
              style="padding:10px 18px;border-radius:10px;border:none;background:transparent;color:#5B5E80;font-weight:600;font-size:13px;cursor:pointer;"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="saving()"
              [style]="ui.saveBtn"
              [style.opacity]="saving() ? 0.7 : 1"
            >
              {{ saving() ? 'Saving…' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class EntityModal {
  readonly title = input.required<string>();
  readonly fields = input.required<ReadonlyArray<FieldDef>>();
  readonly initial = input<Record<string, unknown>>({});
  readonly saving = input(false);
  readonly error = input<string | null>(null);

  readonly save = output<Record<string, unknown>>();
  readonly cancel = output<void>();
  /** A select changed — lets the parent swap the field list (plan specs depend on the product). */
  readonly fieldChange = output<{ key: string; value: string }>();

  protected readonly ui = UI;
  /** Mutable copy for ngModel; re-seeded whenever the parent hands over a new `initial`. */
  protected draft: Record<string, any> = {};

  constructor() {
    effect(() => {
      this.draft = { ...this.initial() };
    });
  }

  protected hasMulti(key: string, opt: string): boolean {
    return Array.isArray(this.draft[key]) && this.draft[key].includes(opt);
  }

  protected toggleMulti(key: string, opt: string): void {
    const current: Array<string> = Array.isArray(this.draft[key]) ? [...this.draft[key]] : [];
    const index = current.indexOf(opt);
    index >= 0 ? current.splice(index, 1) : current.push(opt);
    this.draft[key] = current;
  }

  protected submit(): void {
    const out: Record<string, unknown> = { ...this.draft };
    for (const f of this.fields()) {
      if (f.type === 'number')
        out[f.key] = out[f.key] === '' || out[f.key] == null ? null : Number(out[f.key]);
      if (f.type === 'checkbox') out[f.key] = !!out[f.key];
    }
    this.save.emit(out);
  }
}
