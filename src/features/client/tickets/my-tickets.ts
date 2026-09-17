/** ---------------------------------------------------------------------------------------------------------------------
 * @file my-tickets.ts
 * @fileOverview My Tickets: the customer's tickets, most recently active first, and the "Open a
 *               ticket" modal (subject, priority, related service, message). `?service=<id>` from a
 *               service card's "Get support" pre-selects that service and opens the modal.
 */
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { FieldDef, UI, pill } from '@src/features/admin/_component/admin-ui';
import { EntityModal } from '@src/features/admin/_component/entity-modal';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';
import { MyServicesStore } from '@src/store/website/my-services.store';
import { MyTicketsStore, OpenTicketBody } from '@src/store/website/my-tickets.store';
import {
  TICKET_PRIORITIES,
  priorityTint,
  statusTint,
  timeAgo,
} from '@src/shared/components/ticket/ticket.model';

const NO_SERVICE = { value: '', label: 'Not about a specific service' };

@Component({
  selector: 'zx-my-tickets',
  imports: [RouterLink, EntityModal],
  templateUrl: './my-tickets.html',
})
export class MyTickets {
  protected readonly store = inject(MyTicketsStore);
  private readonly services = inject(MyServicesStore);
  private readonly toast = inject(AdminToastStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly ui = UI;
  protected readonly pill = pill;
  protected readonly statusTint = statusTint;
  protected readonly priorityTint = priorityTint;
  protected readonly ago = timeAgo;
  protected readonly routes = appRoutes;

  protected readonly modalOpen = signal(false);
  protected readonly draft = signal<Record<string, unknown>>({});

  protected readonly fields = computed<Array<FieldDef>>(() => [
    { key: 'subject', label: 'Subject', type: 'text', required: true },
    { key: 'priority', label: 'Priority', type: 'select', options: TICKET_PRIORITIES },
    {
      key: 'serviceId',
      label: 'Related service',
      type: 'select',
      options: [
        NO_SERVICE,
        ...this.services
          .items()
          .map((s) => ({ value: s._id, label: `${s.serviceId} · ${s.label}` })),
      ],
    },
    { key: 'message', label: 'How can we help?', type: 'textarea', required: true },
  ]);

  constructor() {
    void this.store.load();
    void this.services.load();

    const preselected = this.route.snapshot.queryParamMap.get('service');
    if (preselected) this.openModal(preselected);
  }

  protected openModal(serviceId = ''): void {
    this.draft.set({ subject: '', priority: 'Medium', serviceId, message: '' });
    this.store.clearError();
    this.modalOpen.set(true);
  }

  protected async submit(draft: Record<string, unknown>): Promise<void> {
    const body: OpenTicketBody = {
      subject: String(draft['subject'] ?? ''),
      message: String(draft['message'] ?? ''),
      priority: draft['priority'] as OpenTicketBody['priority'],
      serviceId: draft['serviceId'] ? String(draft['serviceId']) : null,
    };

    const ticket = await this.store.open(body);
    if (ticket) {
      this.modalOpen.set(false);
      this.toast.flash(`Ticket #${ticket.number} opened`);
      void this.router.navigateByUrl(appRoutes.AccountTicket(ticket._id));
    }
  }
}
