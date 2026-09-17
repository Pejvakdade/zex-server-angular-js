import { TOKEN_COOKIE, clearCookie, getCookie, setCookie } from './cookie';

describe('cookie helpers', () => {
  afterEach(() => clearCookie(TOKEN_COOKIE));

  it('round-trips a value, encoding characters a cookie cannot carry raw', () => {
    setCookie(TOKEN_COOKIE, 'a.b;c=d');

    expect(document.cookie).toContain(`${TOKEN_COOKIE}=a.b%3Bc%3Dd`);
    expect(getCookie(TOKEN_COOKIE)).toBe('a.b;c=d');
  });

  it('returns null for a cookie that is not set', () => {
    expect(getCookie('nope')).toBeNull();
  });

  it('clears a cookie so the next read is null', () => {
    setCookie(TOKEN_COOKIE, 'token');
    clearCookie(TOKEN_COOKIE);

    expect(getCookie(TOKEN_COOKIE)).toBeNull();
  });
});
