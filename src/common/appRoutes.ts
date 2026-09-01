/** ---------------------------------------------------------------------------------------------------------------------
 * @file appRoutes.ts
 * @fileOverview single source of truth for the frontend's own page paths. Use these instead of
 *               hardcoded routerLink / router.navigate strings.
 *
 * Page names mirror the reference pages in ../ZexServerAdditionalPages.
 */
export const appRoutes = {
  // Website
  Home: '/',
  VpsHosting: '/vps-hosting',
  WindowsVps: '/windows-vps',
  TradingVps: '/trading-vps',
  DedicatedServers: '/dedicated-servers',
  WebHosting: '/web-hosting',
  WordPressHosting: '/wordpress-hosting',
  SoftwareLicenses: '/software-licenses',
  Locations: '/locations',
  AboutUs: '/about-us',
  ContactUs: '/contact-us',
  Support: '/support',
  TermsOfService: '/terms-of-service',
  PrivacyPolicy: '/privacy-policy',
  Login: '/login',
  GetStarted: '/get-started',

  // Admin
  AdminLogin: '/admin/login',
  AdminDashboard: '/admin/overview',
  AdminSection: (key: string) => `/admin/${key}`,
} as const;

export default appRoutes;
