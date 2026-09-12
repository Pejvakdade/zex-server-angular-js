/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-locations.store.ts
 * @fileOverview every datacenter location (inactive included) for the dashboard table and for the
 *               location <select> in the plan editor.
 */
import { signalStore } from '@ngrx/signals';

import apiRoutes from '@src/common/apiRoutes';
import { withCrud } from './_crud.feature';

export interface AdminLocation {
  _id: string;
  city: string;
  country: string;
  flag: string;
  datacenter: string;
  network: string;
  latencyLabel: string;
  latencyValue: string;
  products: Array<string>;
  description: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  sortOrder: number;
}

export const AdminLocationsStore = signalStore(
  { providedIn: 'root' },
  withCrud<AdminLocation>({
    list: apiRoutes.locationAdminAll,
    create: apiRoutes.location,
    byId: apiRoutes.locationById,
  }),
);
