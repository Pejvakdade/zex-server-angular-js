/** ---------------------------------------------------------------------------------------------------------------------
 * @file apiRoutes.ts
 * @fileOverview single source of truth for every backend endpoint path. Mirrors the NestJS
 *               controllers 1:1. Add new endpoints here rather than inlining path strings.
 *
 * Paths are relative to the API root (which already carries the backend's `api/v1` prefix).
 */
export const apiRoutes = {
  health: 'health',

  // Counters
  fleetStats: 'stats/fleet',
  adminOverview: 'stats/overview',

  // User / auth
  signIn: 'user/sign-in',
  signUp: 'user/sign-up',
  me: 'user/me',
  user: 'user',
  userById: (id: string) => `user/${id}`,
  staff: 'user/staff',

  // Catalogue
  plan: 'plan',
  planAdminAll: 'plan/admin/all',
  planById: (id: string) => `plan/${id}`,
  planByProduct: (product: string) => `plan?product=${encodeURIComponent(product)}`,
  location: 'location',
  locationAdminAll: 'location/admin/all',
  locationById: (id: string) => `location/${id}`,
  productContent: 'product-content',
  license: 'license',
  licenseAdminAll: 'license/admin/all',
  licenseById: (id: string) => `license/${id}`,
  contactMessage: 'contact-message',
  contactMessageById: (id: string) => `contact-message/${id}`,
  siteContentByPage: (page: string) => `site-content/${page}`,
  productContentByProduct: (product: string) => `product-content/${encodeURIComponent(product)}`,
  productContentRaw: (product: string) => `product-content/${encodeURIComponent(product)}/raw`,

  // Phase 6 — services, billing, support desk
  service: 'service',
  serviceMe: 'service/me',
  serviceById: (id: string) => `service/${id}`,
  invoice: 'invoice',
  invoiceMe: 'invoice/me',
  invoiceById: (id: string) => `invoice/${id}`,
  invoicePay: (id: string) => `invoice/${id}/pay`,
  ticket: 'ticket',
  ticketMe: 'ticket/me',
  ticketById: (id: string) => `ticket/${id}`,
  ticketReply: (id: string) => `ticket/${id}/reply`,
} as const;

export default apiRoutes;
