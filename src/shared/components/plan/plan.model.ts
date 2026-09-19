/** ---------------------------------------------------------------------------------------------------------------------
 * @file plan.model.ts
 * @fileOverview the plan shape the API returns.
 *
 * @note `priceStr` and `featureList` are computed by the backend (PlanNamespace.buildFeatureList),
 *       not here. The reference recomputed them in every page's own script, which is exactly how two
 *       copies of one rule drift apart — so the frontend just renders what it is given.
 */
export type PlanProduct =
  | 'VPS Hosting'
  | 'Windows VPS'
  | 'Trading VPS'
  | 'Dedicated Servers'
  | 'Web Hosting'
  | 'WordPress Hosting';

export interface Plan {
  _id: string;
  product: PlanProduct;
  name: string;
  tagline: string;
  price: number;
  priceStr: string;
  popular: boolean;
  location: string;
  /** raw spec values keyed by field — the selector reads `storage` for hosting tab labels */
  specs: Record<string, string>;
  featureList: Array<string>;
}
