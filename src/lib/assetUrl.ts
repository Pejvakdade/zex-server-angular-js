/** ---------------------------------------------------------------------------------------------------------------------
 * @file assetUrl.ts
 * @fileOverview turns a backend-relative file path (`/uploads/banners/x.webp`, as stored in site content) into
 *               something the browser can load: `environment.resourceUrl` in front, which is the backend origin in
 *               development and empty in production (nginx proxies `/uploads/` to the backend).
 */
import { environment } from '@src/environments/environment';

export const assetUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return `${environment.resourceUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

/** `background-image` value for a `.zx-hero` — `null` (no inline style) when the page has no banner. */
export const heroBackground = (path: string | null | undefined): string | null =>
  path ? `url("${assetUrl(path)}")` : null;
