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
  Blog: '/blog',
  BlogPost: (slug: string) => `/blog/${slug}`,
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
  AdminServices: '/admin/services',
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
  /** One editor per product page (Site Content → VPS Hosting …); slug = product name kebab-cased. */
  AdminSiteProduct: (slug: string) => `/admin/site/products/${slug}`,
  AdminBlog: '/admin/blog',
  AdminBlogNew: '/admin/blog/new',
  AdminBlogEdit: (id: string) => `/admin/blog/${id}`,
  AdminStaff: '/admin/staff',
  AdminSettings: '/admin/settings',

  // Customer panel — no reference page; an admin-style shell for a signed-in CLIENT
  Account: '/account',
  AccountServices: '/account/services',
  AccountInvoices: '/account/invoices',
  AccountTickets: '/account/tickets',
  AccountTicket: (id: string) => `/account/tickets/${id}`,
  AccountProfile: '/account/profile',
  AccountOrder: (planId: string) => `/account/order/${planId}`,
} as const;

export default appRoutes;
