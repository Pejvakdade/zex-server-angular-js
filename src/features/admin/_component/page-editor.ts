/** ---------------------------------------------------------------------------------------------------------------------
 * @file page-editor.ts
 * @fileOverview the reference's PAGE CONTENT FORM SECTION as one reusable editor: a card of scalar
 *               fields with "Save changes", then each item group as tiles or a table with its own
 *               add / edit / delete modal. Every site page and every product page is this component
 *               with a different PageEditorConfig (see site-content-configs.ts).
 *
 * Saving: scalar edits go out when the button is pressed; an item add/edit/delete emits `save`
 * immediately with the whole updated object, which is how the reference persisted its `db`.
 */
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminLocationsStore } from '@src/store/admin/admin-locations.store';

import { ConfirmDialog } from './confirm-dialog';
import { DataTable } from './data-table';
import { EntityModal } from './entity-modal';
import {
  FieldDef,
  ItemGroupConfig,
  PageEditorConfig,
  Row,
  UI,
  optionLabel,
  optionValue,
} from './admin-ui';
import { LineIcon } from '@src/shared/components/line-icon/line-icon';
import { NavIcon } from './nav-icon';
import { IconName } from './admin-nav';

type Item = Record<string, any>;

@Component({
  selector: 'zx-page-editor',
  imports: [FormsModule, DataTable, EntityModal, ConfirmDialog, NavIcon, LineIcon],
  templateUrl: './page-editor.html',
})
export class PageEditor {
  readonly config = input.required<PageEditorConfig>();
  readonly content = input<Record<string, unknown> | null>(null);
  readonly saving = input(false);
  readonly error = input<string | null>(null);

  readonly save = output<Record<string, unknown>>();

  private readonly locations = inject(AdminLocationsStore);

  protected readonly ui = UI;
  /** ngModel target for the scalar card; re-seeded whenever new content arrives. */
  protected draft: Record<string, any> = {};

  // item modal / confirm state
  protected readonly group = signal<ItemGroupConfig | null>(null);
  protected readonly editIndex = signal<number | null>(null);
  protected readonly itemDraft = signal<Item>({});
  protected readonly deleting = signal<{
    group: ItemGroupConfig;
    index: number;
    label: string;
  } | null>(null);

  /** `locationCities` is the one field whose options are live data: the location table's cities. */
  private readonly withLiveOptions = (fields: ReadonlyArray<FieldDef>): Array<FieldDef> =>
    fields.map((field) =>
      field.key === 'locationCities'
        ? { ...field, options: this.locations.items().map((l) => l.city) }
        : field,
    );

  protected readonly scalarFields = computed(() => this.withLiveOptions(this.config().fields));
  protected readonly modalFields = computed(() =>
    this.group() ? this.withLiveOptions(this.group()!.fields) : [],
  );

  constructor() {
    effect(() => {
      this.draft = { ...(this.content() ?? {}) };
    });
    void this.locations.load();
  }

  protected items(group: ItemGroupConfig): Array<Item> {
    const list = this.content()?.[group.key];
    return Array.isArray(list) ? (list as Array<Item>) : [];
  }

  protected rows(group: ItemGroupConfig): Array<Row<Item>> {
    return this.items(group).map((item, index) => {
      const shown = group.display(item);
      return {
        id: String(index),
        label: shown.title,
        data: item,
        cells: group.columns!.map((_, column) => ({
          text: [shown.title, shown.subtitle, shown.icon ?? ''][column] ?? '',
        })),
      };
    });
  }

  protected isIcon(name: string | undefined): name is IconName {
    return !!name && !/\p{Extended_Pictographic}/u.test(name);
  }

  protected readonly optionValue = optionValue;
  protected readonly optionLabel = optionLabel;

  protected hasMulti(key: string, opt: string): boolean {
    return Array.isArray(this.draft[key]) && this.draft[key].includes(opt);
  }

  protected toggleMulti(key: string, opt: string): void {
    const current: Array<string> = Array.isArray(this.draft[key]) ? [...this.draft[key]] : [];
    const index = current.indexOf(opt);
    index >= 0 ? current.splice(index, 1) : current.push(opt);
    this.draft[key] = current;
  }

  protected saveScalars(): void {
    const next = { ...(this.content() ?? {}) };
    for (const field of this.config().fields) next[field.key] = this.draft[field.key];
    this.save.emit(next);
  }

  protected openAdd(group: ItemGroupConfig): void {
    const blank: Item = {};
    for (const field of group.fields) {
      blank[field.key] =
        field.type === 'multiselect'
          ? []
          : field.type === 'checkbox'
            ? false
            : field.type === 'number'
              ? null
              : field.type === 'select'
                ? (field.options?.[0] ?? '')
                : '';
    }
    this.group.set(group);
    this.editIndex.set(null);
    this.itemDraft.set(group.toDraft ? group.toDraft(blank) : blank);
  }

  protected openEdit(group: ItemGroupConfig, index: number): void {
    const item = this.items(group)[index];
    this.group.set(group);
    this.editIndex.set(index);
    this.itemDraft.set(group.toDraft ? group.toDraft(item) : { ...item });
  }

  protected saveItem(draft: Item): void {
    const group = this.group();
    if (!group) return;

    const index = this.editIndex();
    const previous = index === null ? null : this.items(group)[index];
    const item = group.fromDraft ? group.fromDraft(draft, previous) : { ...previous, ...draft };

    const list = [...this.items(group)];
    index === null ? list.push(item) : list.splice(index, 1, item);

    this.group.set(null);
    this.save.emit({ ...(this.content() ?? {}), [group.key]: list });
  }

  protected askDelete(group: ItemGroupConfig, index: number): void {
    this.deleting.set({ group, index, label: group.display(this.items(group)[index]).title });
  }

  protected confirmDelete(): void {
    const pending = this.deleting();
    if (!pending) return;

    const list = this.items(pending.group).filter((_, i) => i !== pending.index);
    this.deleting.set(null);
    this.save.emit({ ...(this.content() ?? {}), [pending.group.key]: list });
  }
}
