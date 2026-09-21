/** ---------------------------------------------------------------------------------------------------------------------
 * @file theme.service.ts
 * @fileOverview light / dark theme. Resolution order: the `zexTheme` cookie (an explicit choice) →
 *               the device's `prefers-color-scheme` → light. Applied as `<html data-theme="…">`, which
 *               is what the dark block in styles/tokens.css keys on. index.html runs the same three-step
 *               lookup inline before Angular boots so a dark reload never flashes white.
 */
import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

import { getCookie, setCookie } from './cookie';

export type Theme = 'light' | 'dark';

export const THEME_COOKIE = 'zexTheme';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const DARK_QUERY = '(prefers-color-scheme: dark)';

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly media = this.document.defaultView?.matchMedia?.(DARK_QUERY) ?? null;

  private readonly current = signal<Theme>(this.resolve());
  readonly theme = this.current.asReadonly();

  constructor() {
    this.apply(this.current());
    // No cookie means "follow the device", so keep following it while the tab is open.
    this.media?.addEventListener('change', () => {
      if (!isTheme(getCookie(THEME_COOKIE))) this.apply(this.resolve());
    });
  }

  /** Explicit choice — remembered for a year, overrides the device setting. */
  set(theme: Theme): void {
    setCookie(THEME_COOKIE, theme, COOKIE_MAX_AGE);
    this.apply(theme);
  }

  toggle(): void {
    this.set(this.current() === 'dark' ? 'light' : 'dark');
  }

  private resolve(): Theme {
    const saved = getCookie(THEME_COOKIE);
    if (isTheme(saved)) return saved;
    return this.media?.matches ? 'dark' : 'light';
  }

  private apply(theme: Theme): void {
    this.current.set(theme);
    this.document.documentElement.dataset['theme'] = theme;
  }
}
