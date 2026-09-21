/** ---------------------------------------------------------------------------------------------------------------------
 * @file markdown-toolbar.ts
 * @fileOverview the row of buttons above the post editor's textarea. Each one wraps or prefixes the current
 *               selection with Markdown and emits the new text plus where the caret should land, so the
 *               editor stays the single owner of the body. `applyAction` is a pure function so it can be
 *               unit-tested without a DOM.
 */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { UI } from './admin-ui';

export type MarkdownAction =
  | 'h2'
  | 'h3'
  | 'bold'
  | 'italic'
  | 'link'
  | 'image'
  | 'code'
  | 'quote'
  | 'ul'
  | 'ol';

export interface MarkdownEdit {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

const ACTIONS: Array<{ action: MarkdownAction; label: string; title: string }> = [
  { action: 'h2', label: 'H2', title: 'Heading' },
  { action: 'h3', label: 'H3', title: 'Sub-heading' },
  { action: 'bold', label: 'B', title: 'Bold' },
  { action: 'italic', label: 'I', title: 'Italic' },
  { action: 'link', label: 'Link', title: 'Link' },
  { action: 'image', label: 'Image', title: 'Image' },
  { action: 'code', label: '</>', title: 'Code' },
  { action: 'quote', label: '❝', title: 'Quote' },
  { action: 'ul', label: '• List', title: 'Bulleted list' },
  { action: 'ol', label: '1. List', title: 'Numbered list' },
];

/** Wraps the selection (or inserts a placeholder) and returns the new text and selection. */
export function applyAction(action: MarkdownAction, text: string, start: number, end: number): MarkdownEdit {
  const selected = text.slice(start, end);
  const before = text.slice(0, start);
  const after = text.slice(end);

  const wrap = (open: string, close: string, placeholder: string): MarkdownEdit => {
    const inner = selected || placeholder;
    const next = `${before}${open}${inner}${close}${after}`;
    return { text: next, selectionStart: start + open.length, selectionEnd: start + open.length + inner.length };
  };

  /** Puts `prefix` at the start of every selected line (or the current one), on its own paragraph. */
  const linePrefix = (prefix: (index: number) => string, placeholder: string): MarkdownEdit => {
    const lineStart = before.lastIndexOf('\n') + 1;
    const head = text.slice(0, lineStart);
    const block = (text.slice(lineStart, end) || placeholder).split('\n').map((line, i) => prefix(i) + line);
    const body = block.join('\n');
    const needsGap = head.length > 0 && !head.endsWith('\n\n');
    const next = `${head}${needsGap ? '\n' : ''}${body}${after}`;
    const selStart = head.length + (needsGap ? 1 : 0);
    return { text: next, selectionStart: selStart, selectionEnd: selStart + body.length };
  };

  switch (action) {
    case 'h2':
      return linePrefix(() => '## ', 'Heading');
    case 'h3':
      return linePrefix(() => '### ', 'Sub-heading');
    case 'bold':
      return wrap('**', '**', 'bold text');
    case 'italic':
      return wrap('_', '_', 'italic text');
    case 'link':
      return wrap('[', '](https://)', 'link text');
    case 'image':
      return wrap('![', '](https://)', 'alt text');
    case 'code':
      return selected.includes('\n') ? wrap('```\n', '\n```', 'code') : wrap('`', '`', 'code');
    case 'quote':
      return linePrefix(() => '> ', 'Quote');
    case 'ul':
      return linePrefix(() => '- ', 'List item');
    case 'ol':
      return linePrefix((i) => `${i + 1}. `, 'List item');
  }
}

@Component({
  selector: 'zx-markdown-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="toolbar"
      aria-label="Formatting"
      style="display:flex;gap:6px;flex-wrap:wrap;padding:8px 10px;border:1.5px solid var(--zx-border);border-bottom:none;border-radius:10px 10px 0 0;background:var(--zx-bg-tint);"
    >
      @for (item of actions; track item.action) {
        <button
          type="button"
          [title]="item.title"
          [attr.aria-label]="item.title"
          [disabled]="disabled()"
          (mousedown)="$event.preventDefault()"
          (click)="pick.emit(item.action)"
          [style]="ui.viewBtn"
          style="padding:5px 10px;font-size:12px;"
          [style.font-weight]="item.action === 'bold' ? 800 : 600"
          [style.font-style]="item.action === 'italic' ? 'italic' : 'normal'"
        >
          {{ item.label }}
        </button>
      }
    </div>
  `,
})
export class MarkdownToolbar {
  readonly disabled = input(false);
  readonly pick = output<MarkdownAction>();

  protected readonly ui = UI;
  protected readonly actions = ACTIONS;
}
