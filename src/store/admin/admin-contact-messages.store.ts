/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-contact-messages.store.ts
 * @fileOverview the contact-form inbox shown under Site Content → Contact Us (and, newest five, on
 *               the Overview).
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';

import { Paginated } from './admin-users.store';

export type MessageStatus = 'New' | 'Read' | 'Archived';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

type InboxState = {
  page: Paginated<ContactMessage>;
  status: MessageStatus | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
};

const EMPTY_PAGE: Paginated<ContactMessage> = {
  docs: [],
  totalDocs: 0,
  limit: 10,
  page: 1,
  totalPages: 0,
};

export const AdminContactMessagesStore = signalStore(
  { providedIn: 'root' },
  withState<InboxState>({
    page: EMPTY_PAGE,
    status: null,
    loading: false,
    saving: false,
    error: null,
  }),
  withMethods((store, api = inject(ApiService)) => {
    const load = async (pageNumber = 1): Promise<void> => {
      patchState(store, { loading: true, error: null });
      const params = new URLSearchParams({ page: String(pageNumber), limit: '10' });
      if (store.status()) params.set('status', store.status()!);

      try {
        const page = await firstValueFrom(
          api.get<Paginated<ContactMessage>>(`${apiRoutes.contactMessage}?${params.toString()}`),
        );
        patchState(store, { page, loading: false });
      } catch (error) {
        patchState(store, { loading: false, error: readError(error) });
      }
    };

    const write = async (request: () => Promise<unknown>): Promise<boolean> => {
      patchState(store, { saving: true, error: null });
      try {
        await request();
        await load(store.page().page);
        patchState(store, { saving: false });
        return true;
      } catch (error) {
        patchState(store, { saving: false, error: readError(error) });
        return false;
      }
    };

    return {
      load,
      setStatusFilter: (status: MessageStatus | null) => patchState(store, { status }),
      setStatus: (id: string, status: MessageStatus) =>
        write(() => firstValueFrom(api.patch(apiRoutes.contactMessageById(id), { status }))),
      remove: (id: string) =>
        write(() => firstValueFrom(api.delete(apiRoutes.contactMessageById(id)))),
    };
  }),
);
