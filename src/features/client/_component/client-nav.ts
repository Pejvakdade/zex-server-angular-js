/** ---------------------------------------------------------------------------------------------------------------------
 * @file client-nav.ts
 * @fileOverview the customer panel's sidebar items and page headings. Same shape as admin-nav so the
 *               layout renders them the same way; icons come from the admin ICON_PATHS set.
 */
import appRoutes from '@src/common/appRoutes';
import { NavItem, SectionTitle } from '@src/features/admin/_component/admin-nav';

export const CLIENT_NAV: Array<NavItem> = [
  { label: 'My Services', icon: 'server', path: appRoutes.AccountServices },
  { label: 'Invoices', icon: 'card', path: appRoutes.AccountInvoices },
  { label: 'Tickets', icon: 'ticket', path: appRoutes.AccountTickets },
  { label: 'Profile', icon: 'gear', path: appRoutes.AccountProfile },
];

export const CLIENT_TITLES = {
  services: { title: 'My Services', subtitle: 'Your servers, hosting plans and licences.' },
  invoices: { title: 'Invoices', subtitle: 'Your billing history.' },
  tickets: { title: 'Tickets', subtitle: 'Your conversations with our support team.' },
  ticket: { title: 'Ticket', subtitle: '' },
  profile: { title: 'Profile', subtitle: 'Your account details and password.' },
} as const satisfies Record<string, SectionTitle>;
