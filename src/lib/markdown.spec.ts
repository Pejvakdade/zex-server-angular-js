import { renderMarkdown } from './markdown';

describe('renderMarkdown', () => {
  it('renders headings, emphasis and links', () => {
    const html = renderMarkdown('## Title\n\nSome **bold** and a [link](/blog).');
    expect(html).toContain('<h2>Title</h2>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<a href="/blog">link</a>');
  });

  it('renders GFM tables and fenced code', () => {
    const html = renderMarkdown('| a | b |\n|---|---|\n| 1 | 2 |\n\n```bash\nls\n```');
    expect(html).toContain('<table>');
    expect(html).toContain('<code class="language-bash">');
  });

  it('strips scripts and inline handlers', () => {
    const html = renderMarkdown('<script>alert(1)</script><img src=x onerror="alert(1)"> ok');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('onerror');
    expect(html).toContain('ok');
  });

  it('returns an empty string for empty input', () => {
    expect(renderMarkdown('')).toBe('');
    expect(renderMarkdown(null)).toBe('');
  });
});
