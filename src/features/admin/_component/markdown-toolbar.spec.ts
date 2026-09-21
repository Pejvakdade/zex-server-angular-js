import { applyAction } from './markdown-toolbar';

describe('applyAction', () => {
  it('wraps a selection in bold markers and keeps it selected', () => {
    const edit = applyAction('bold', 'say hello now', 4, 9);
    expect(edit.text).toBe('say **hello** now');
    expect(edit.text.slice(edit.selectionStart, edit.selectionEnd)).toBe('hello');
  });

  it('inserts a placeholder when nothing is selected', () => {
    const edit = applyAction('link', '', 0, 0);
    expect(edit.text).toBe('[link text](https://)');
    expect(edit.text.slice(edit.selectionStart, edit.selectionEnd)).toBe('link text');
  });

  it('prefixes every selected line for lists and numbers them', () => {
    const edit = applyAction('ol', 'a\nb\nc', 0, 5);
    expect(edit.text).toBe('1. a\n2. b\n3. c');
  });

  it('turns the caret line into a heading, or starts a new one after a paragraph', () => {
    expect(applyAction('h2', 'intro', 5, 5).text).toBe('## intro');
    expect(applyAction('h2', 'intro\n', 6, 6).text).toBe('intro\n\n## Heading');
  });

  it('uses a fenced block for multi-line code and inline ticks otherwise', () => {
    expect(applyAction('code', 'x', 0, 1).text).toBe('`x`');
    expect(applyAction('code', 'a\nb', 0, 3).text).toBe('```\na\nb\n```');
  });
});
