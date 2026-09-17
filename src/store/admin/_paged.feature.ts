/** ---------------------------------------------------------------------------------------------------------------------
 * @file _paged.feature.ts
 * @fileOverview the paginated-list + filters + write shape shared by the phase-6 admin stores
 *               (services, invoices, tickets). The `_crud.feature` sibling is for un-paginated
 *               catalogue lists; this one carries a `Paginated` page and a filter object that is
 *               serialised straight into the query string.
 */
import { inject } from '@angular/core';
import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';

import { Paginated } from './admin-users.store';

export type Filters = Record<string, string | null>;

export type PagedState<TRow, TFilters extends Filters> = {
  page: Paginated<TRow>;
  filters: TFilters;
  loading: boolean;
  saving: boolean;
  error: string | null;
};

export const emptyPage = <TRow>(): Paginated<TRow> => ({
  docs: [],
  totalDocs: 0,
  limit: 10,
  page: 1,
  totalPages: 0,
});

export function withPaged<TRow extends { _id: string }, TFilters extends Filters>(
  listPath: string,
  initialFilters: TFilters,
  limit = 10,
) {
  return signalStoreFeature(
    withState<PagedState<TRow, TFilters>>({
      page: emptyPage<TRow>(),
      filters: initialFilters,
      loading: false,
      saving: false,
      error: null,
    }),
    withMethods((store, api = inject(ApiService)) => {
      const load = async (pageNumber = 1): Promise<void> => {
        patchState(store, { loading: true, error: null });
        const params = new URLSearchParams({ page: String(pageNumber), limit: String(limit) });
        for (const [key, value] of Object.entries(store.filters())) {
          if (value && value.trim()) params.set(key, value.trim());
        }

        try {
          const page = await firstValueFrom(
            api.get<Paginated<TRow>>(`${listPath}?${params.toString()}`),
          );
          patchState(store, { page, loading: false });
        } catch (error) {
          patchState(store, { loading: false, error: readError(error) });
        }
      };

      /** Runs one write, reloads the current page, and reports success so the caller can close its modal. */
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
        write,
        setFilter: (key: keyof TFilters & string, value: string | null) =>
          patchState(store, { filters: { ...store.filters(), [key]: value } }),
        clearError: () => patchState(store, { error: null }),
      };
    }),
  );
}
