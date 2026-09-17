/** ---------------------------------------------------------------------------------------------------------------------
 * @file ticket.model.ts
 * @fileOverview the ticket / reply shapes and the pill tints both the admin desk and the customer
 *               panel render — the reference's ticketStatusStyle / ticketPriorityStyle.
 */
import { Tint } from '@src/features/admin/_component/admin-ui';
import { PublicUser } from '@src/store/website/auth.store';

export type TicketStatus = 'Open' | 'Pending' | 'Closed';
export type TicketPriority = 'High' | 'Medium' | 'Low';

export const TICKET_STATUSES: ReadonlyArray<TicketStatus> = ['Open', 'Pending', 'Closed'];
export const TICKET_PRIORITIES: ReadonlyArray<TicketPriority> = ['High', 'Medium', 'Low'];

export interface TicketReply {
  _id: string;
  ticketId: string;
  authorId: string;
  authorType: 'staff' | 'customer';
  authorName: string;
  text: string;
  createdAt: string;
}

export interface Ticket {
  _id: string;
  number: number;
  subject: string;
  message: string;
  customerId: string;
  customer?: PublicUser;
  serviceId?: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  lastActivityAt: string;
  createdAt: string;
  replies?: Array<TicketReply>;
}

export const statusTint = (status: TicketStatus): Tint =>
  status === 'Open' ? 'blue' : status === 'Pending' ? 'amber' : 'neutral';

export const priorityTint = (priority: TicketPriority): Tint =>
  priority === 'High' ? 'red' : priority === 'Medium' ? 'amber' : 'neutral';

/** "2 hours ago" / "Yesterday" / "3 days ago" — the reference's `updated` column, computed. */
export const timeAgo = (iso: string): string => {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
};
