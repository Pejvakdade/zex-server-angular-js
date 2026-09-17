/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-product-content.store.ts
 * @fileOverview one product page's stored row (location cities unresolved) for the editor.
 */
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';
import { ProductContentStore } from '@src/store/website/product-content.store';

import { PageContent } from './admin-site-content.store';

/** Row bookkeeping the PATCH DTO does not accept (forbidNonWhitelisted would reject them). */
const READ_ONLY_KEYS = ['_id', 'createdAt', 'updatedAt', 'product'];

type State = {
  product: string | null;
  content: PageContent | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
};

export const AdminProductContentStore = signalStore(
  { providedIn: 'root' },
  withState<State>({ product: null, content: null, loading: false, saving: false, error: null }),
  withMethods((store, api = inject(ApiService), publicStore = inject(ProductContentStore)) => ({
    async load(product: string): Promise<void> {
      patchState(store, { product, content: null, loading: true, error: null });
      try {
        const content = await firstValueFrom(
          api.get<PageContent>(apiRoutes.productContentRaw(product)),
        );
        patchState(store, { content, loading: false });
      } catch (error) {
        patchState(store, { loading: false, error: readError(error) });
      }
    },

    async save(content: PageContent): Promise<boolean> {
      const product = store.product();
      if (!product) return false;

      const body = Object.fromEntries(
        Object.entries(content).filter(([key]) => !READ_ONLY_KEYS.includes(key)),
      );

      patchState(store, { saving: true, error: null });
      try {
        const saved = await firstValueFrom(
          api.patch<PageContent>(apiRoutes.productContentByProduct(product), body),
        );
        patchState(store, { content: saved, saving: false });
        publicStore.invalidate(product);
        return true;
      } catch (error) {
        patchState(store, { saving: false, error: readError(error) });
        return false;
      }
    },
  })),
);
