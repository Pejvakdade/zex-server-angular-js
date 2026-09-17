/** ---------------------------------------------------------------------------------------------------------------------
 * @file tickets.ts
 * @fileOverview Admin → Tickets: the reference's REG.tickets table (Ticket, Subject, Customer,
 *               Priority, Status, Updated) with its TICKET DETAIL DIALOG — thread, reply, mark closed —
 *               over the real `ticket` table. The table's Edit button opens the dialog ("View").
 */
import { Component, computed, inject, signal } from '@angular/core';

import { AdminTicketsStore } from '@src/store/admin/admin-tickets.store';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  Ticket,
  TicketPriority,
  TicketStatus,
  priorityTint,
  statusTint,
  timeAgo,
} from '@src/shared/components/ticket/ticket.model';
import { TicketThread } from '@src/shared/components/ticket/ticket-thread';

import { ConfirmDialog } from '../_component/confirm-dialog';
import { customerLabel } from '../_component/customer-options';
import { DataTable } from '../_component/data-table';
import { Row, UI, pill } from '../_component/admin-ui';
import { Pager } from '../_component/pager';

@Component({
  selector: 'zx-admin-tickets',
  imports: [DataTable, ConfirmDialog, Pager, TicketThread],
  templateUrl: './tickets.html',
})
export class Tickets {
  protected readonly store = inject(AdminTicketsStore);
  private readonly toast = inject(AdminToastStore);

  protected readonly ui = UI;
  protected readonly pill = pill;
  protected readonly statusTint = statusTint;
  protected readonly priorityTint = priorityTint;
  protected readonly ago = timeAgo;
  protected readonly statuses = TICKET_STATUSES;
  protected readonly priorities = TICKET_PRIORITIES;
  protected readonly columns = ['Ticket', 'Subject', 'Customer', 'Priority', 'Status', 'Updated'];

  protected readonly rows = computed<Array<Row<Ticket>>>(() =>
    this.store.page().docs.map((ticket) => ({
      id: ticket._id,
      label: `#${ticket.number} ${ticket.subject}`,
      data: ticket,
      cells: [
        { text: `#${ticket.number}` },
        { text: ticket.subject },
        { text: customerLabel(ticket.customer) },
        { text: ticket.priority, tint: priorityTint(ticket.priority) },
        { text: ticket.status, tint: statusTint(ticket.status) },
        { text: timeAgo(ticket.lastActivityAt) },
      ],
    })),
  );

  protected readonly deleting = signal<Row<Ticket> | null>(null);

  constructor() {
    void this.store.load();
  }

  protected open(row: Row): void {
    this.store.clearError();
    void this.store.select(row.id);
  }

  protected async reply(text: string): Promise<void> {
    const selected = this.store.selected();
    if (!selected) return;
    if (await this.store.reply(selected._id, text)) this.toast.flash('Reply sent');
  }

  protected async setTicketStatus(status: TicketStatus): Promise<void> {
    const selected = this.store.selected();
    if (!selected) return;
    if (await this.store.setStatus(selected._id, status)) {
      this.toast.flash(status === 'Closed' ? 'Ticket closed' : `Ticket marked ${status}`);
    }
  }

  protected async onPriority(event: Event): Promise<void> {
    const selected = this.store.selected();
    if (!selected) return;
    const priority = (event.target as HTMLSelectElement).value as TicketPriority;
    if (await this.store.setPriority(selected._id, priority)) this.toast.flash('Priority updated');
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleting();
    if (!row) return;
    if (await this.store.remove(row.id)) {
      this.deleting.set(null);
      this.toast.flash('Ticket deleted');
    }
  }

  protected setStatus(status: TicketStatus | null): void {
    this.store.setFilter('status', status);
    void this.store.load();
  }

  protected onPriorityFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.setFilter('priority', value || null);
    void this.store.load();
  }

  protected onSearch(event: Event): void {
    this.store.setFilter('search', (event.target as HTMLInputElement).value);
    void this.store.load();
  }

  protected goTo(page: number): void {
    void this.store.load(page);
  }
}
