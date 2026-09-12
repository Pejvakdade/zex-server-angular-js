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
  green: 'background:#EAF6EC;color:#16A34A;',
  red: 'background:#FEE2E2;color:#DC2626;',
  amber: 'background:#FEF3C7;color:#B45309;',
  blue: 'background:#EEF0FE;color:#1269E8;',
  neutral: 'background:#F1F2F8;color:#6B6E96;',
};

export const pill = (tint: Tint): string => PILL_BASE + TINTS[tint];

export const UI = {
  thead:
    'text-align:left;font-size:12px;color:#8386AC;font-weight:700;text-transform:uppercase;letter-spacing:0.3px;padding:10px 14px;border-bottom:1px solid #EEF0FA;',
  td: 'padding:14px;font-size:13.5px;color:#3A3D5C;border-bottom:1px solid #F3F4FC;',
  tdMuted: 'padding:14px;font-size:13px;color:#8386AC;border-bottom:1px solid #F3F4FC;',
  addBtn:
    'padding:10px 18px;border-radius:10px;border:none;background:linear-gradient(135deg,#1269E8,#7C3AED);color:#fff;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;box-shadow:0 8px 20px rgba(18,105,232,0.24);',
  saveBtn:
    'padding:11px 22px;border-radius:10px;border:none;background:linear-gradient(135deg,#1269E8,#7C3AED);color:#fff;font-weight:700;font-size:13.5px;cursor:pointer;box-shadow:0 8px 20px rgba(18,105,232,0.24);',
  editBtn:
    'padding:6px 12px;border-radius:8px;border:1.5px solid #E0E3F5;background:#fff;color:#161629;font-weight:600;font-size:12px;cursor:pointer;margin-left:6px;',
  deleteBtn:
    'padding:6px 12px;border-radius:8px;border:1.5px solid #FBD5D5;background:#fff;color:#DC2626;font-weight:600;font-size:12px;cursor:pointer;margin-left:6px;',
  viewBtn:
    'padding:6px 12px;border-radius:8px;border:1.5px solid #E0E3F5;background:#fff;color:#161629;font-weight:600;font-size:12px;cursor:pointer;',
  input:
    'padding:12px 14px;border-radius:10px;border:1.5px solid #E0E3F5;font-size:14px;width:100%;box-sizing:border-box;',
  textarea:
    'padding:12px 14px;border-radius:10px;border:1.5px solid #E0E3F5;font-size:14px;width:100%;box-sizing:border-box;resize:vertical;',
  chip: 'padding:7px 14px;border-radius:20px;font-size:12.5px;font-weight:600;border:1px solid #E0E3F5;background:#fff;color:#5B5E80;cursor:pointer;',
  chipActive:
    'padding:7px 14px;border-radius:20px;font-size:12.5px;font-weight:600;border:1px solid #1269E8;background:#EEF0FE;color:#1269E8;cursor:pointer;',
  select:
    'padding:9px 14px;border-radius:999px;border:1.5px solid #E0E3F5;background:#fff;color:#3A3D5C;font-weight:600;font-size:13px;cursor:pointer;',
  search:
    'padding:9px 14px;border-radius:10px;border:1.5px solid #E0E3F5;background:#fff;color:#161629;font-size:13px;min-width:200px;',
  card: 'background:#fff;border:1px solid #EEF0FA;border-radius:16px;padding:28px 30px;box-shadow:0 4px 14px rgba(30,20,90,0.04);',
  label: 'font-size:13px;font-weight:600;color:#3A3D5C;',
} as const;

/** One input in the add/edit modal. `options` for select; `multi` selects store an array. */
export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'multiselect';
  options?: ReadonlyArray<string>;
  required?: boolean;
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
}
