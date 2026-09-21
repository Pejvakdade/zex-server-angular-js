/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-tickets.store.ts
 * @fileOverview Admin → Tickets: the paginated desk plus the thread open in the detail dialog.
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';
import { Ticket, TicketPriority, TicketStatus } from '@src/shared/components/ticket/ticket.model';

import { withPaged } from './_paged.feature';

export type {
  Ticket,
  TicketPriority,
  TicketReply,
  TicketStatus,
} from '@src/shared/components/ticket/ticket.model';

export type TicketFilters = {
  status: string | null;
  priority: string | null;
  customerId: string | null;
  search: string | null;
};

export const AdminTicketsStore = signalStore(
  { providedIn: 'root' },
  withPaged<Ticket, TicketFilters>(apiRoutes.ticket, {
    status: null,
    priority: null,
    customerId: null,
    search: null,
  }),
  withState<{ selected: Ticket | null; threadLoading: boolean }>({
    selected: null,
    threadLoading: false,
  }),
  withMethods((store, api = inject(ApiService)) => {
    /** A write on the open thread: the API returns the refreshed thread, which replaces `selected`. */
    const threadWrite = async (request: () => Promise<Ticket>): Promise<boolean> => {
      patchState(store, { saving: true, error: null });
      try {
        const selected = await request();
        patchState(store, { selected, saving: false });
        await store.load(store.page().page);
        return true;
      } catch (error) {
        patchState(store, { saving: false, error: readError(error) });
        return false;
      }
    };

    return {
      async select(id: string): Promise<void> {
        patchState(store, { threadLoading: true, error: null });
        try {
          const selected = await firstValueFrom(api.get<Ticket>(apiRoutes.ticketById(id)));
          patchState(store, { selected, threadLoading: false });
        } catch (error) {
          patchState(store, { threadLoading: false, error: readError(error) });
        }
      },
      close: () => patchState(store, { selected: null }),
      reply: (id: string, text: string) =>
        threadWrite(() => firstValueFrom(api.post<Ticket>(apiRoutes.ticketReply(id), { text }))),
      setStatus: (id: string, status: TicketStatus) =>
        threadWrite(() => firstValueFrom(api.patch<Ticket>(apiRoutes.ticketById(id), { status }))),
      setPriority: (id: string, priority: TicketPriority) =>
        threadWrite(() =>
          firstValueFrom(api.patch<Ticket>(apiRoutes.ticketById(id), { priority })),
        ),
      remove: (id: string) =>
        store.write(() => firstValueFrom(api.delete(apiRoutes.ticketById(id)))),
      /** Staff opening a ticket on a customer's behalf ("+ Add Ticket"); `customerId` picks the owner. */
      create: (body: { subject: string; message: string; priority?: TicketPriority; customerId: string }) =>
        store.write(() => firstValueFrom(api.post<Ticket>(apiRoutes.ticket, body))),
    };
  }),
);
