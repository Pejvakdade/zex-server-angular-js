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

  // Admin — one entry per sidebar item in Admin Dashboard.dc.html (SECTION_GROUPS)
  AdminLogin: '/admin/login',
  AdminDashboard: '/admin/overview',
  AdminOverview: '/admin/overview',
  AdminCustomers: '/admin/customers',
  AdminBilling: '/admin/billing',
  AdminTickets: '/admin/tickets',
  AdminPlans: '/admin/plans',
  AdminLicenses: '/admin/licenses',
  AdminLocations: '/admin/locations',
  AdminSiteHome: '/admin/site/home',
  AdminSiteAbout: '/admin/site/about',
  AdminSiteContact: '/admin/site/contact',
  AdminSiteSupport: '/admin/site/support',
  AdminSiteFooter: '/admin/site/footer',
  AdminSiteLegal: '/admin/site/legal',
  AdminSiteProductPages: '/admin/site/product-pages',
  AdminStaff: '/admin/staff',
  AdminSettings: '/admin/settings',
} as const;

export default appRoutes;
