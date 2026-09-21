/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-ui.ts
 * @fileOverview the reference's style constants (PILL_BASE / TINTS / THEAD / TD / *_BTN / INPUT_STYLE …)
 *               kept as strings so ported markup can bind them verbatim, plus the field-definition
 *               type the entity modal is driven by (the reference's *_FIELDS arrays).
 */
export type Tint = 'green' | 'red' | 'amber' | 'blue' | 'neutral';

const PILL_BASE =
  'display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:11.5px;font-weight:700;white-space:nowrap;';

const TINTS: Record<Tint, string> = {
  green: 'background:var(--zx-green-bg);color:var(--zx-green-fg);',
  red: 'background:var(--zx-red-bg);color:var(--zx-red-fg);',
  amber: 'background:var(--zx-amber-bg);color:var(--zx-amber-fg);',
  blue: 'background:var(--zx-surface-active);color:var(--zx-primary);',
  neutral: 'background:var(--zx-neutral-bg);color:var(--zx-neutral-fg);',
};

export const pill = (tint: Tint): string => PILL_BASE + TINTS[tint];

export const UI = {
  thead:
    'text-align:left;font-size:12px;color:var(--zx-text-faint);font-weight:700;text-transform:uppercase;letter-spacing:0.3px;padding:10px 14px;border-bottom:1px solid var(--zx-border-soft);',
  td: 'padding:14px;font-size:13.5px;color:var(--zx-text);border-bottom:1px solid var(--zx-row-border);',
  tdMuted:
    'padding:14px;font-size:13px;color:var(--zx-text-faint);border-bottom:1px solid var(--zx-row-border);',
  addBtn:
    'padding:10px 18px;border-radius:10px;border:none;background:linear-gradient(135deg,var(--zx-primary),var(--zx-violet));color:var(--zx-on-accent);font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;box-shadow:0 8px 20px rgba(18,105,232,0.24);',
  saveBtn:
    'padding:11px 22px;border-radius:10px;border:none;background:linear-gradient(135deg,var(--zx-primary),var(--zx-violet));color:var(--zx-on-accent);font-weight:700;font-size:13.5px;cursor:pointer;box-shadow:0 8px 20px rgba(18,105,232,0.24);',
  editBtn:
    'padding:6px 12px;border-radius:8px;border:1.5px solid var(--zx-border);background:var(--zx-bg);color:var(--zx-ink);font-weight:600;font-size:12px;cursor:pointer;margin-left:6px;',
  deleteBtn:
    'padding:6px 12px;border-radius:8px;border:1.5px solid var(--zx-red-border);background:var(--zx-bg);color:var(--zx-red-fg);font-weight:600;font-size:12px;cursor:pointer;margin-left:6px;',
  viewBtn:
    'padding:6px 12px;border-radius:8px;border:1.5px solid var(--zx-border);background:var(--zx-bg);color:var(--zx-ink);font-weight:600;font-size:12px;cursor:pointer;',
  input:
    'padding:12px 14px;border-radius:10px;border:1.5px solid var(--zx-border);font-size:14px;width:100%;box-sizing:border-box;',
  textarea:
    'padding:12px 14px;border-radius:10px;border:1.5px solid var(--zx-border);font-size:14px;width:100%;box-sizing:border-box;resize:vertical;',
  chip: 'padding:7px 14px;border-radius:20px;font-size:12.5px;font-weight:600;border:1px solid var(--zx-border);background:var(--zx-bg);color:var(--zx-text-muted);cursor:pointer;',
  chipActive:
    'padding:7px 14px;border-radius:20px;font-size:12.5px;font-weight:600;border:1px solid var(--zx-primary);background:var(--zx-surface-active);color:var(--zx-primary);cursor:pointer;',
  select:
    'padding:9px 14px;border-radius:999px;border:1.5px solid var(--zx-border);background:var(--zx-bg);color:var(--zx-text);font-weight:600;font-size:13px;cursor:pointer;',
  search:
    'padding:9px 14px;border-radius:10px;border:1.5px solid var(--zx-border);background:var(--zx-bg);color:var(--zx-ink);font-size:13px;min-width:200px;',
  card: 'background:var(--zx-bg);border:1px solid var(--zx-border-soft);border-radius:16px;padding:28px 30px;box-shadow:0 4px 14px rgba(30,20,90,0.04);',
  label: 'font-size:13px;font-weight:600;color:var(--zx-text);',
} as const;

/** The line icons an editor may pick for a content item — the reference's KB_ICON_OPTIONS. */
export const KB_ICON_OPTIONS = [
  'info',
  'card',
  'server',
  'shield',
  'license',
  'bars',
  'book',
  'globe',
  'headset',
  'ticket',
  'gear',
  'key',
  'database',
  'cloud',
  'cpu',
  'harddrive',
  'wifi',
  'lock',
  'unlock',
  'terminal',
  'code',
  'rocket',
  'zap',
  'clock',
  'refresh',
  'alert',
  'checkCircle',
  'chat',
  'fileText',
  'folder',
  'dollar',
  'wrench',
  'download',
  'upload',
  'activity',
  'monitor',
] as const;

/** A select option: a bare string (value = label) or a value/label pair (a uuid shown by name). */
export type SelectOption = string | { value: string; label: string };

export const optionValue = (opt: SelectOption): string =>
  typeof opt === 'string' ? opt : opt.value;
export const optionLabel = (opt: SelectOption): string =>
  typeof opt === 'string' ? opt : opt.label;

/** Hero banner requirements — the backend enforces the same numbers (`BANNER_*` in its constants). */
export const BANNER_WIDTH = 1920;
export const BANNER_HEIGHT = 560;
export const BANNER_MAX_BYTES = 2 * 1024 * 1024;
export const BANNER_HINT = `Required size: ${BANNER_WIDTH} × ${BANNER_HEIGHT} px · JPG, PNG or WebP · max 2 MB`;

/**
 * One input in the add/edit modal. `options` for select / multiselect (multiselect stores an
 * array); `icon` is a chip picker over KB_ICON_OPTIONS; `date` stores an ISO yyyy-mm-dd string;
 * `image` is an upload slot (zx-image-upload) that stores the uploaded file's URL, with `hint`
 * telling the editor which size to upload.
 */
export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'multiselect' | 'icon' | 'date' | 'image';
  options?: ReadonlyArray<SelectOption>;
  required?: boolean;
  hint?: string;
}

/** A repeated-item section of a page editor (feature strip, FAQ, footer columns …). */
export interface ItemGroupConfig {
  /** Key of the array inside the page's content object. */
  key: string;
  heading: string;
  /** "+ Add {singular}". */
  singular: string;
  fields: Array<FieldDef>;
  /** How an item is summarised on its tile / row. */
  display: (item: Record<string, any>) => { title: string; subtitle: string; icon?: string };
  /** `grid` = the reference's 220px tiles (default); `table` = a data table with `columns`. */
  layout?: 'grid' | 'table';
  columns?: Array<string>;
  /** Item ⇄ modal draft conversion, when the stored shape is not flat (footer column links). */
  toDraft?: (item: Record<string, any>) => Record<string, any>;
  fromDraft?: (
    draft: Record<string, any>,
    previous: Record<string, any> | null,
  ) => Record<string, any>;
}

export interface PageEditorConfig {
  /** Scalar fields, saved by the card's "Save changes" button. */
  fields: Array<FieldDef>;
  groups: Array<ItemGroupConfig>;
}

/** A cell in the generic table: text plus an optional status-pill tint. */
export interface Cell {
  text: string;
  tint?: Tint;
}

export interface Row<T = unknown> {
  id: string;
  cells: Array<Cell>;
  label: string;
  data: T;
  /** Hide the delete button (e.g. the signed-in admin's own row). */
  noDelete?: boolean;
  /** Hide the table's optional action button on this row (an already-paid invoice). */
  noAction?: boolean;
}
