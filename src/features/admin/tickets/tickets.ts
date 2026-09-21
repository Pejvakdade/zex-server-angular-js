/** ---------------------------------------------------------------------------------------------------------------------
 * @file tickets.ts
 * @fileOverview Admin → Tickets: the reference's REG.tickets table (Ticket, Subject, Customer,
 *               Priority, Status, Updated) with its TICKET DETAIL DIALOG — thread, reply, mark closed —
 *               over the real `ticket` table. The table's Edit button opens the dialog ("View"), and
 *               "+ Add Ticket" lets staff open one on a customer's behalf (POST /ticket + customerId).
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
import { CustomerOptions, customerLabel } from '../_component/customer-options';
import { DataTable } from '../_component/data-table';
import { EntityModal } from '../_component/entity-modal';
import { FieldDef, Row, UI, pill } from '../_component/admin-ui';
import { Pager } from '../_component/pager';

@Component({
  selector: 'zx-admin-tickets',
  imports: [DataTable, EntityModal, ConfirmDialog, Pager, TicketThread],
  templateUrl: './tickets.html',
})
export class Tickets {
  protected readonly store = inject(AdminTicketsStore);
  private readonly customers = inject(CustomerOptions);
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

  /** "+ Add Ticket" — the reference's TICKET_FIELDS minus the number / status, which the backend assigns. */
  protected readonly createFields = computed<Array<FieldDef>>(() => [
    { key: 'subject', label: 'Subject', type: 'text', required: true },
    { key: 'customerId', label: 'Customer', type: 'select', options: this.customers.options() },
    { key: 'priority', label: 'Priority', type: 'select', options: TICKET_PRIORITIES },
    { key: 'message', label: 'Message', type: 'textarea', required: true },
  ]);
  protected readonly createOpen = signal(false);
  protected readonly createDraft = signal<Record<string, unknown>>({});

  constructor() {
    void this.store.load();
    void this.customers.load();
  }

  protected openCreate(): void {
    this.createDraft.set({ subject: '', customerId: '', priority: 'Medium', message: '' });
    this.store.clearError();
    this.createOpen.set(true);
  }

  protected async create(draft: Record<string, unknown>): Promise<void> {
    const body = draft as { subject: string; message: string; priority: TicketPriority; customerId: string };
    if (await this.store.create(body)) {
      this.createOpen.set(false);
      this.toast.flash('Ticket opened');
    }
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
