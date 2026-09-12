/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-licenses.store.ts
 * @fileOverview every software licence (inactive included) for the dashboard table.
 */
import { signalStore } from '@ngrx/signals';

import apiRoutes from '@src/common/apiRoutes';
import { withCrud } from './_crud.feature';

export interface AdminLicense {
  _id: string;
  name: string;
  category: string;
  description: string;
  features: Array<string>;
  price: number;
  priceStr: string;
  installFee: number;
  installFeeStr: string;
  isActive: boolean;
  sortOrder: number;
}

export const AdminLicensesStore = signalStore(
  { providedIn: 'root' },
  withCrud<AdminLicense>({
    list: apiRoutes.licenseAdminAll,
    create: apiRoutes.license,
    byId: apiRoutes.licenseById,
  }),
);
