/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-users.store.ts
 * @fileOverview the paginated account list behind both Customers (userType = client) and Staff &
 *               Users (admin / staff). One store, two views: the section sets its `userType` filter
 *               on load, and the table is the same either way.
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';
import { PublicUser, UserType } from '@src/store/website/auth.store';

export type UserStatus = 'Active' | 'Suspended';

export interface Paginated<TRow> {
  docs: Array<TRow>;
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
}

type AdminUsersState = {
  page: Paginated<PublicUser>;
  /** One type or a comma list — the Staff view asks for 'admin,staff'. */
  userType: string | null;
  status: UserStatus | null;
  search: string;
  loading: boolean;
  saving: boolean;
  error: string | null;
};

const EMPTY_PAGE: Paginated<PublicUser> = {
  docs: [],
  totalDocs: 0,
  limit: 10,
  page: 1,
  totalPages: 0,
};

export const AdminUsersStore = signalStore(
  { providedIn: 'root' },
  withState<AdminUsersState>({
    page: EMPTY_PAGE,
    userType: null,
    status: null,
    search: '',
    loading: false,
    saving: false,
    error: null,
  }),
  withMethods((store, api = inject(ApiService)) => {
    const load = async (pageNumber = 1): Promise<void> => {
      patchState(store, { loading: true, error: null });
      const params = new URLSearchParams({ page: String(pageNumber), limit: '20' });
      if (store.userType()) params.set('userType', store.userType()!);
      if (store.status()) params.set('status', store.status()!);
      if (store.search().trim()) params.set('search', store.search().trim());

      try {
        const page = await firstValueFrom(
          api.get<Paginated<PublicUser>>(`${apiRoutes.user}?${params.toString()}`),
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
      /** Which slice of accounts this section shows; resets search and page. */
      setScope: (userType: string | null) =>
        patchState(store, { userType, status: null, search: '', page: EMPTY_PAGE }),
      setStatus: (status: UserStatus | null) => patchState(store, { status }),
      setSearch: (search: string) => patchState(store, { search }),
      update: (id: string, body: Partial<PublicUser>) =>
        write(() => firstValueFrom(api.patch(apiRoutes.userById(id), body))),
      createStaff: (body: {
        fullName: string;
        email: string;
        password: string;
        userType: UserType;
      }) => write(() => firstValueFrom(api.post(apiRoutes.staff, body))),
      remove: (id: string) => write(() => firstValueFrom(api.delete(apiRoutes.userById(id)))),
      clearError: () => patchState(store, { error: null }),
    };
  }),
);
