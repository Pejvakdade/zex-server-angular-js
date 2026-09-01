/** ---------------------------------------------------------------------------------------------------------------------
 * @file product-content.store.ts
 * @fileOverview editorial content per product page, keyed so several products can be cached at once.
 */
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';

export interface IconItem {
  icon: string;
  title: string;
  subtitle: string;
}

export interface IconLabel {
  icon: string;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductLocation {
  city: string;
  country: string;
  flag: string;
}

export interface ProductContent {
  product: string;
  heroBadge: string;
  heroHeading1: string;
  heroHeadingAccent: string;
  heroSubheading: string;
  ctaHeading: string;
  ctaSubheading: string;
  featureStrip: Array<IconItem>;
  whyChoose: Array<IconItem>;
  faq: Array<FaqItem>;
  gridOneTitle: string;
  gridOneSubtitle: string;
  gridOne: Array<IconLabel>;
  gridTwoTitle: string;
  gridTwoSubtitle: string;
  gridTwo: Array<IconLabel>;
  locations: Array<ProductLocation>;
}

type ProductContentState = {
  byProduct: Record<string, ProductContent | null>;
  loading: boolean;
};

export const ProductContentStore = signalStore(
  { providedIn: 'root' },
  withState<ProductContentState>({ byProduct: {}, loading: false }),
  withComputed(({ byProduct }) => ({
    forProduct: computed(() => (product: string) => byProduct()[product] ?? null),
  })),
  withMethods((store, api = inject(ApiService)) => ({
    async load(product: string): Promise<void> {
      if (product in store.byProduct()) return;

      patchState(store, { loading: true });
      try {
        const content = await firstValueFrom(
          api.get<ProductContent>(apiRoutes.productContentByProduct(product)),
        );
        patchState(store, { byProduct: { ...store.byProduct(), [product]: content }, loading: false });
      } catch {
        // null means "no content published" — the page renders its sections conditionally, so it
        // degrades to the pricing grid rather than showing empty headings.
        patchState(store, { byProduct: { ...store.byProduct(), [product]: null }, loading: false });
      }
    },
  })),
);
