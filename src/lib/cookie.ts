/** ---------------------------------------------------------------------------------------------------------------------
 * @file cookie.ts
 * @fileOverview minimal document.cookie helpers. The JWT lives in a cookie (not localStorage) to keep
 *               parity with Miveh's `miveUserToken` convention.
 */
export const TOKEN_COOKIE = 'zexUserToken';

export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export const setCookie = (name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 7): void => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
};

export const clearCookie = (name: string): void => {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};
