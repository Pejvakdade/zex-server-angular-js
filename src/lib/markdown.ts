/** ---------------------------------------------------------------------------------------------------------------------
 * @file markdown.ts
 * @fileOverview Markdown → safe HTML, in one place so the admin editor's preview and the public post page
 *               render identically. `marked` does the parsing; DOMPurify strips anything that could run.
 */
import DOMPurify from 'dompurify';
import { marked } from 'marked';

marked.use({ gfm: true, breaks: false });

export const renderMarkdown = (markdown: string | null | undefined): string => {
  if (!markdown) return '';
  const html = marked.parse(markdown, { async: false }) as string;
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
};
