/** ---------------------------------------------------------------------------------------------------------------------
 * @file my-tickets.store.ts
 * @fileOverview the customer panel's My Tickets: the list, opening a new ticket, and the thread
 *               currently open on the detail page.
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';
import { Ticket, TicketPriority } from '@src/shared/components/ticket/ticket.model';

export interface OpenTicketBody {
  subject: string;
  message: string;
  priority: TicketPriority;
  serviceId?: string | null;
}

type MyTicketsState = {
  items: Array<Ticket>;
  selected: Ticket | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
};

export const MyTicketsStore = signalStore(
  { providedIn: 'root' },
  withState<MyTicketsState>({
    items: [],
    selected: null,
    loading: false,
    saving: false,
    error: null,
  }),
  withMethods((store, api = inject(ApiService)) => {
    const load = async (): Promise<void> => {
      patchState(store, { loading: true, error: null });
      try {
        const items = await firstValueFrom(api.get<Array<Ticket>>(apiRoutes.ticketMe));
        patchState(store, { items, loading: false });
      } catch (error) {
        patchState(store, { loading: false, error: readError(error) });
      }
    };

    return {
      load,

      async select(id: string): Promise<void> {
        patchState(store, { selected: null, loading: true, error: null });
        try {
          const selected = await firstValueFrom(api.get<Ticket>(apiRoutes.ticketById(id)));
          patchState(store, { selected, loading: false });
        } catch (error) {
          patchState(store, { loading: false, error: readError(error) });
        }
      },

      /** Returns the new ticket so the page can navigate straight into it. */
      async open(body: OpenTicketBody): Promise<Ticket | null> {
        patchState(store, { saving: true, error: null });
        try {
          const ticket = await firstValueFrom(api.post<Ticket>(apiRoutes.ticket, body));
          patchState(store, { saving: false });
          await load();
          return ticket;
        } catch (error) {
          patchState(store, { saving: false, error: readError(error) });
          return null;
        }
      },

      async reply(id: string, text: string): Promise<boolean> {
        patchState(store, { saving: true, error: null });
        try {
          const selected = await firstValueFrom(
            api.post<Ticket>(apiRoutes.ticketReply(id), { text }),
          );
          patchState(store, { selected, saving: false });
          return true;
        } catch (error) {
          patchState(store, { saving: false, error: readError(error) });
          return false;
        }
      },

      clearError: () => patchState(store, { error: null }),
    };
  }),
);
