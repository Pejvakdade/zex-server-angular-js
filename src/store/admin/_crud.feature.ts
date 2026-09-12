/** ---------------------------------------------------------------------------------------------------------------------
 * @file _crud.feature.ts
 * @fileOverview the list + create/update/remove shape every catalogue store in the dashboard shares
 *               (plans, licences, locations). One SignalStore feature so the three stores differ only
 *               in their endpoint paths and row type.
 *
 * The list is re-fetched after each write rather than patched locally: the API decorates rows
 * (priceStr, featureList) and the backend, not the browser, decides sort order.
 */
import { inject } from '@angular/core';
import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';

export type CrudState<TRow> = {
  items: Array<TRow>;
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  error: string | null;
};

export const crudInitialState = <TRow>(): CrudState<TRow> => ({
  items: [],
  loading: false,
  loaded: false,
  saving: false,
  error: null,
});

export function withCrud<TRow extends { _id: string }>(paths: {
  list: string;
  create: string;
  byId: (id: string) => string;
}) {
  return signalStoreFeature(
    withState<CrudState<TRow>>(crudInitialState<TRow>()),
    withMethods((store, api = inject(ApiService)) => {
      const load = async (): Promise<void> => {
        patchState(store, { loading: true, error: null });
        try {
          const items = await firstValueFrom(api.get<Array<TRow>>(paths.list));
          patchState(store, { items, loading: false, loaded: true });
        } catch (error) {
          patchState(store, { loading: false, error: readError(error) });
        }
      };

      /** Runs one write, reloads the list, and reports success so the caller can close its modal. */
      const write = async (request: () => Promise<unknown>): Promise<boolean> => {
        patchState(store, { saving: true, error: null });
        try {
          await request();
          await load();
          patchState(store, { saving: false });
          return true;
        } catch (error) {
          patchState(store, { saving: false, error: readError(error) });
          return false;
        }
      };

      return {
        load,
        create: (body: Partial<TRow>) => write(() => firstValueFrom(api.post(paths.create, body))),
        update: (id: string, body: Partial<TRow>) =>
          write(() => firstValueFrom(api.patch(paths.byId(id), body))),
        remove: (id: string) => write(() => firstValueFrom(api.delete(paths.byId(id)))),
        clearError: () => patchState(store, { error: null }),
      };
    }),
  );
}
