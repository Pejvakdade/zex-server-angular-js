/** ---------------------------------------------------------------------------------------------------------------------
 * @file ticket-detail.ts
 * @fileOverview one ticket as a page: heading with status / priority, the shared thread, reply box.
 */
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';

import appRoutes from '@src/common/appRoutes';
import { UI, pill } from '@src/features/admin/_component/admin-ui';
import { TicketThread } from '@src/shared/components/ticket/ticket-thread';
import { priorityTint, statusTint, timeAgo } from '@src/shared/components/ticket/ticket.model';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';
import { MyTicketsStore } from '@src/store/website/my-tickets.store';

@Component({
  selector: 'zx-ticket-detail',
  imports: [RouterLink, TicketThread],
  templateUrl: './ticket-detail.html',
})
export class TicketDetail {
  /** Bound from the `:id` route param (withComponentInputBinding). */
  readonly id = input.required<string>();

  protected readonly store = inject(MyTicketsStore);
  private readonly toast = inject(AdminToastStore);

  protected readonly ui = UI;
  protected readonly pill = pill;
  protected readonly statusTint = statusTint;
  protected readonly priorityTint = priorityTint;
  protected readonly ago = timeAgo;
  protected readonly routes = appRoutes;

  constructor() {
    toObservable(this.id).subscribe((id) => void this.store.select(id));
  }

  protected async reply(text: string): Promise<void> {
    if (await this.store.reply(this.id(), text)) this.toast.flash('Reply sent');
  }
}
