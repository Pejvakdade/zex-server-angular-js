/** ---------------------------------------------------------------------------------------------------------------------
 * @file environment.ts — production. `baseUrl` must include the backend's global `api/v1` prefix.
 *
 * Both URLs are relative on purpose: the nginx in front of the bundle proxies `/api/` to the backend
 * container (see nginx.conf), so the same image works on any hostname without a rebuild.
 */
export const environment = {
  production: true,
  baseUrl: '/api/v1',
  resourceUrl: '',
};
