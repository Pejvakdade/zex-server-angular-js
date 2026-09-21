import { TestBed } from '@angular/core/testing';

import { clearCookie, getCookie, setCookie } from './cookie';
import { THEME_COOKIE, ThemeService } from './theme.service';

type Listener = (event: { matches: boolean }) => void;

/** stubs window.matchMedia so a test can pick the device preference and later flip it */
function stubMatchMedia(matches: boolean) {
  const listeners: Listener[] = [];
  const media = {
    matches,
    addEventListener: (_: string, fn: Listener) => listeners.push(fn),
  };
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => media),
  );
  return {
    flip(next: boolean) {
      media.matches = next;
      listeners.forEach((fn) => fn({ matches: next }));
    },
  };
}

const make = () => TestBed.inject(ThemeService);

describe('ThemeService', () => {
  beforeEach(() => {
    clearCookie(THEME_COOKIE);
    delete document.documentElement.dataset['theme'];
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    clearCookie(THEME_COOKIE);
    vi.unstubAllGlobals();
  });

  it('defaults to light when there is no cookie and no device preference', () => {
    stubMatchMedia(false);

    expect(make().theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('follows the device when there is no cookie', () => {
    stubMatchMedia(true);

    expect(make().theme()).toBe('dark');
  });

  it('prefers the cookie over the device', () => {
    stubMatchMedia(true);
    setCookie(THEME_COOKIE, 'light');

    expect(make().theme()).toBe('light');
  });

  it('ignores a cookie holding something other than light / dark', () => {
    stubMatchMedia(true);
    setCookie(THEME_COOKIE, 'sepia');

    expect(make().theme()).toBe('dark');
  });

  it('toggle writes the cookie and the html attribute', () => {
    stubMatchMedia(false);
    const service = make();

    service.toggle();

    expect(service.theme()).toBe('dark');
    expect(getCookie(THEME_COOKIE)).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('keeps following device changes until the user makes a choice', () => {
    const media = stubMatchMedia(false);
    const service = make();

    media.flip(true);
    expect(service.theme()).toBe('dark');

    service.set('light');
    media.flip(false);
    media.flip(true);
    expect(service.theme()).toBe('light');
  });
});
