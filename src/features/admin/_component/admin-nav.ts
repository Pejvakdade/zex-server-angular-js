/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-nav.ts
 * @fileOverview the sidebar's data: SECTION_GROUPS, TITLES and ICON_PATHS copied from
 *               ../ZexServerAdditionalPages/Admin Dashboard.dc.html, with each item bound to its
 *               appRoutes path instead of the reference's in-memory `activeSection` key.
 */
import appRoutes from '@src/common/appRoutes';

export type IconName = keyof typeof ICON_PATHS;

/** [svg element, attributes] pairs — rendered by <zx-nav-icon>, the reference's renderIcon(). */
export const ICON_PATHS = {
  grid: [
    ['rect', { x: 3, y: 3, width: 7, height: 7, rx: 1.5 }],
    ['rect', { x: 14, y: 3, width: 7, height: 7, rx: 1.5 }],
    ['rect', { x: 3, y: 14, width: 7, height: 7, rx: 1.5 }],
    ['rect', { x: 14, y: 14, width: 7, height: 7, rx: 1.5 }],
  ],
  server: [
    ['rect', { x: 2, y: 3, width: 20, height: 8, rx: 2 }],
    ['rect', { x: 2, y: 13, width: 20, height: 8, rx: 2 }],
    ['line', { x1: 6, y1: 7, x2: 6.01, y2: 7 }],
    ['line', { x1: 6, y1: 17, x2: 6.01, y2: 17 }],
  ],
  users: [
    ['path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }],
    ['circle', { cx: 9, cy: 7, r: 4 }],
    ['path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }],
    ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }],
  ],
  card: [
    ['rect', { x: 1, y: 4, width: 22, height: 16, rx: 2 }],
    ['line', { x1: 1, y1: 10, x2: 23, y2: 10 }],
  ],
  ticket: [
    ['circle', { cx: 12, cy: 12, r: 10 }],
    ['circle', { cx: 12, cy: 12, r: 4 }],
    ['line', { x1: 4.93, y1: 4.93, x2: 9.17, y2: 9.17 }],
    ['line', { x1: 14.83, y1: 14.83, x2: 19.07, y2: 19.07 }],
    ['line', { x1: 14.83, y1: 9.17, x2: 19.07, y2: 4.93 }],
    ['line', { x1: 4.93, y1: 19.07, x2: 9.17, y2: 14.83 }],
  ],
  tag: [
    [
      'path',
      {
        d: 'M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.25H4a1 1 0 0 0-1 1v5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l4.59-4.59a2 2 0 0 0 0-2.83Z',
      },
    ],
    ['circle', { cx: 7, cy: 7, r: 1 }],
  ],
  key: [
    ['circle', { cx: 8, cy: 16, r: 4 }],
    ['path', { d: 'M10.5 13.5 20 4' }],
    ['path', { d: 'M17 7l2.5 2.5' }],
    ['path', { d: 'M14 10l2.5 2.5' }],
  ],
  globe: [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', { d: 'M3 12h18' }],
    ['path', { d: 'M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z' }],
  ],
  home: [
    ['path', { d: 'M3 9.5 12 3l9 6.5' }],
    ['path', { d: 'M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5' }],
  ],
  info: [
    ['circle', { cx: 12, cy: 12, r: 10 }],
    ['line', { x1: 12, y1: 16, x2: 12, y2: 12 }],
    ['line', { x1: 12, y1: 8, x2: 12.01, y2: 8 }],
  ],
  mail: [
    ['rect', { x: 2, y: 4, width: 20, height: 16, rx: 2 }],
    ['path', { d: 'M22 6 12 13 2 6' }],
  ],
  headset: [
    ['path', { d: 'M3 18v-6a9 9 0 0 1 18 0v6' }],
    ['path', { d: 'M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z' }],
    ['path', { d: 'M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z' }],
  ],
  gear: [
    ['circle', { cx: 12, cy: 12, r: 3 }],
    [
      'path',
      {
        d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
      },
    ],
  ],
  chevronLeft: [['path', { d: 'M15 18l-6-6 6-6' }]],
  chevronRight: [['path', { d: 'M9 18l6-6-6-6' }]],
  shield: [
    ['path', { d: 'M12 3l7 3v5.5c0 4.3-2.9 7.8-7 9.5-4.1-1.7-7-5.2-7-9.5V6l7-3z' }],
    ['path', { d: 'M9 12.2l2 2 4-4.2' }],
  ],
  license: [
    ['rect', { x: 3, y: 4, width: 18, height: 16, rx: 2.4 }],
    ['path', { d: 'M3 9h18M8.5 9v11' }],
  ],
  bars: [['path', { d: 'M4 18V9M10 18v-6M16 18v-9M22 18V5' }]],
  book: [
    ['path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }],
    ['path', { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' }],
  ],
  // ---- extra content-item icons (site-page editors), feather-style like the ones above --------------------------
  database: [
    ['path', { d: 'M12 3c5 0 8 1.3 8 3s-3 3-8 3-8-1.3-8-3 3-3 8-3z' }],
    ['path', { d: 'M4 6v6c0 1.7 3 3 8 3s8-1.3 8-3V6' }],
    ['path', { d: 'M4 12v6c0 1.7 3 3 8 3s8-1.3 8-3v-6' }],
  ],
  cloud: [['path', { d: 'M18 18H7a4 4 0 0 1-.6-7.95A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9z' }]],
  cpu: [
    ['rect', { x: 5, y: 5, width: 14, height: 14, rx: 2 }],
    ['rect', { x: 9, y: 9, width: 6, height: 6, rx: 1 }],
    ['path', { d: 'M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3' }],
  ],
  harddrive: [
    ['rect', { x: 2, y: 8, width: 20, height: 10, rx: 2 }],
    ['path', { d: 'M4.5 8 7 3.5h10L19.5 8' }],
    ['line', { x1: 6, y1: 13, x2: 6.01, y2: 13 }],
    ['line', { x1: 10, y1: 13, x2: 10.01, y2: 13 }],
  ],
  wifi: [
    ['path', { d: 'M2.5 9.5a14 14 0 0 1 19 0' }],
    ['path', { d: 'M6 13a9 9 0 0 1 12 0' }],
    ['path', { d: 'M9.5 16.5a4 4 0 0 1 5 0' }],
    ['line', { x1: 12, y1: 20, x2: 12.01, y2: 20 }],
  ],
  lock: [
    ['rect', { x: 4, y: 11, width: 16, height: 10, rx: 2 }],
    ['path', { d: 'M8 11V7a4 4 0 0 1 8 0v4' }],
    ['line', { x1: 12, y1: 15, x2: 12, y2: 17 }],
  ],
  unlock: [
    ['rect', { x: 4, y: 11, width: 16, height: 10, rx: 2 }],
    ['path', { d: 'M8 11V7a4 4 0 0 1 7.7-1.5' }],
    ['line', { x1: 12, y1: 15, x2: 12, y2: 17 }],
  ],
  terminal: [
    ['rect', { x: 2, y: 4, width: 20, height: 16, rx: 2 }],
    ['path', { d: 'M6 9l3 3-3 3' }],
    ['line', { x1: 12, y1: 15, x2: 17, y2: 15 }],
  ],
  code: [
    ['path', { d: 'M8 8l-4 4 4 4' }],
    ['path', { d: 'M16 8l4 4-4 4' }],
    ['line', { x1: 14, y1: 4, x2: 10, y2: 20 }],
  ],
  rocket: [
    [
      'path',
      { d: 'M12 15c-2.5-.5-4-2-4.5-4.5C9 6 12 3.5 17.5 3c.5 0 1 .5 1 1-.5 5.5-3 8.5-7.5 10z' },
    ],
    ['path', { d: 'M8 11l-3.5 1.5 2 2M13 15.5l-1.5 3.5-2-2' }],
    ['path', { d: 'M5.5 18.5 4 20' }],
    ['circle', { cx: 14.5, cy: 8.5, r: 1.3 }],
  ],
  zap: [['path', { d: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z' }]],
  clock: [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', { d: 'M12 7v5l3.5 2' }],
  ],
  refresh: [
    ['path', { d: 'M20.5 11A8.5 8.5 0 0 0 5.6 6.4L3.5 8.5' }],
    ['path', { d: 'M3.5 3.5v5h5' }],
    ['path', { d: 'M3.5 13a8.5 8.5 0 0 0 14.9 4.6l2.1-2.1' }],
    ['path', { d: 'M20.5 20.5v-5h-5' }],
  ],
  alert: [
    [
      'path',
      { d: 'M10.3 4.5 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.5a2 2 0 0 0-3.4 0z' },
    ],
    ['line', { x1: 12, y1: 9, x2: 12, y2: 13 }],
    ['line', { x1: 12, y1: 17, x2: 12.01, y2: 17 }],
  ],
  checkCircle: [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', { d: 'M8.5 12.2l2.3 2.3 4.7-4.7' }],
  ],
  chat: [
    ['path', { d: 'M21 12a8 8 0 0 1-8 8H8l-5 3 1.2-4.2A8 8 0 1 1 21 12z' }],
    ['line', { x1: 8.5, y1: 10, x2: 15.5, y2: 10 }],
    ['line', { x1: 8.5, y1: 13.5, x2: 13, y2: 13.5 }],
  ],
  fileText: [
    ['path', { d: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z' }],
    ['path', { d: 'M14 3v5h5' }],
    ['path', { d: 'M9 13h6M9 17h4' }],
  ],
  folder: [
    ['path', { d: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }],
  ],
  dollar: [
    ['line', { x1: 12, y1: 2.5, x2: 12, y2: 21.5 }],
    [
      'path',
      {
        d: 'M16.5 7.5A3.5 3.5 0 0 0 13 5h-2.5a3 3 0 0 0 0 6h3a3 3 0 0 1 0 6H11a3.5 3.5 0 0 1-3.5-2.5',
      },
    ],
  ],
  wrench: [
    [
      'path',
      {
        d: 'M14.5 3a5.5 5.5 0 0 0-4.9 8L3 17.6V21h3.4l6.6-6.6A5.5 5.5 0 0 0 20.5 6.5l-3 3-2.5-2.5 3-3A5.5 5.5 0 0 0 14.5 3z',
      },
    ],
  ],
  download: [
    ['path', { d: 'M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3' }],
    ['path', { d: 'M7.5 10.5 12 15l4.5-4.5' }],
    ['line', { x1: 12, y1: 3, x2: 12, y2: 15 }],
  ],
  upload: [
    ['path', { d: 'M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3' }],
    ['path', { d: 'M7.5 7.5 12 3l4.5 4.5' }],
    ['line', { x1: 12, y1: 3, x2: 12, y2: 15 }],
  ],
  activity: [['path', { d: 'M2.5 12h4l3-7 5 14 3-7h4' }]],
  monitor: [
    ['rect', { x: 2, y: 4, width: 20, height: 13, rx: 2 }],
    ['line', { x1: 8, y1: 21, x2: 16, y2: 21 }],
    ['line', { x1: 12, y1: 17, x2: 12, y2: 21 }],
  ],
} as const satisfies Record<
  string,
  ReadonlyArray<readonly [string, Record<string, string | number>]>
>;

export interface NavItem {
  label: string;
  icon: IconName;
  path: string;
}

export interface NavGroup {
  label: string;
  items: Array<NavItem>;
}

export const NAV_GROUPS: Array<NavGroup> = [
  {
    label: 'Operations',
    items: [
      { label: 'Overview', icon: 'grid', path: appRoutes.AdminOverview },
      { label: 'Customers', icon: 'users', path: appRoutes.AdminCustomers },
      { label: 'Services', icon: 'server', path: appRoutes.AdminServices },
      { label: 'Billing', icon: 'card', path: appRoutes.AdminBilling },
      { label: 'Tickets', icon: 'ticket', path: appRoutes.AdminTickets },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Pricing Plans', icon: 'tag', path: appRoutes.AdminPlans },
      { label: 'Software Licenses', icon: 'key', path: appRoutes.AdminLicenses },
      { label: 'Locations', icon: 'globe', path: appRoutes.AdminLocations },
    ],
  },
  {
    label: 'Site Content',
    items: [
      { label: 'Home', icon: 'home', path: appRoutes.AdminSiteHome },
      { label: 'About Us', icon: 'info', path: appRoutes.AdminSiteAbout },
      { label: 'Contact Us', icon: 'mail', path: appRoutes.AdminSiteContact },
      { label: 'Support', icon: 'headset', path: appRoutes.AdminSiteSupport },
      { label: 'Footer', icon: 'grid', path: appRoutes.AdminSiteFooter },
      { label: 'Legal', icon: 'book', path: appRoutes.AdminSiteLegal },
      { label: 'Product Pages', icon: 'server', path: appRoutes.AdminSiteProductPages },
      { label: 'Blog', icon: 'fileText', path: appRoutes.AdminBlog },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Staff & Users', icon: 'users', path: appRoutes.AdminStaff },
      { label: 'Settings', icon: 'gear', path: appRoutes.AdminSettings },
    ],
  },
];

/** Page heading and subtitle per section — the reference's TITLES, keyed by route data. */
export interface SectionTitle {
  title: string;
  subtitle: string;
}

export const TITLES = {
  overview: {
    title: 'Fleet Overview',
    subtitle: 'Every server, invoice and ticket across the customer base, in one place.',
  },
  customers: {
    title: 'Customers',
    subtitle: 'The accounts behind every service, invoice and ticket.',
  },
  services: {
    title: 'Services',
    subtitle: 'Every provisioned server, hosting plan and licence, per customer.',
  },
  billing: { title: 'Billing', subtitle: 'Invoices and revenue across the customer base.' },
  tickets: { title: 'Tickets', subtitle: 'Support requests from customers.' },
  plans: {
    title: 'Pricing Plans',
    subtitle: 'Every plan shown on the product pages, editable here.',
  },
  licenses: {
    title: 'Software Licenses',
    subtitle: 'Control panel and OS licenses sold on the Software Licenses page.',
  },
  locations: { title: 'Locations', subtitle: 'Datacenters shown on the Locations page.' },
  home: { title: 'Home page', subtitle: 'Copy shown on the public homepage.' },
  about: { title: 'About Us page', subtitle: 'Copy shown on the About Us page.' },
  contact: {
    title: 'Contact Us page',
    subtitle: 'Contact details and copy shown on the Contact Us page.',
  },
  support: { title: 'Support page', subtitle: 'Copy and FAQ shown on the Support page.' },
  footer: { title: 'Footer', subtitle: 'Shown at the bottom of every page.' },
  productContent: {
    title: 'Product Pages',
    subtitle:
      'Hero, feature strip, why-choose cards, FAQ, grids and locations for each product page.',
  },
  legal: { title: 'Legal', subtitle: 'Terms of Service and Privacy Policy shown across the site.' },
  blog: { title: 'Blog', subtitle: 'Articles shown on the Blog page and the homepage slider.' },
  blogEditor: { title: 'Write post', subtitle: 'Markdown body with a live preview; save as a draft or publish.' },
  staff: { title: 'Staff & Users', subtitle: 'Admin console accounts.' },
  settings: { title: 'Settings', subtitle: 'Your admin account.' },
} as const satisfies Record<string, SectionTitle>;
