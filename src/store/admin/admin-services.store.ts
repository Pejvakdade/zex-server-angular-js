/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-services.store.ts
 * @fileOverview Admin → Services: every provisioned service with its customer.
 */
import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { PublicUser } from '@src/store/website/auth.store';

import { withPaged } from './_paged.feature';

export type ServiceStatus = 'Running' | 'Issue' | 'Suspended' | 'Active';

export interface Service {
  _id: string;
  serviceId: string;
  customerId: string;
  customer?: PublicUser;
  planId?: string | null;
  product: string;
  label: string;
  location: string;
  status: ServiceStatus;
  cpu?: number | null;
  ram?: number | null;
  disk?: number | null;
  /** yyyy-mm-dd from the API's `date` column. */
  expiresAt: string;
  monthlyPrice: number;
  createdAt: string;
}

export type ServiceFilters = {
  status: string | null;
  product: string | null;
  customerId: string | null;
  search: string | null;
};

export const AdminServicesStore = signalStore(
  { providedIn: 'root' },
  withPaged<Service, ServiceFilters>(apiRoutes.service, {
    status: null,
    product: null,
    customerId: null,
    search: null,
  }),
  withMethods((store, api = inject(ApiService)) => ({
    create: (body: Partial<Service>) =>
      store.write(() => firstValueFrom(api.post(apiRoutes.service, body))),
    update: (id: string, body: Partial<Service>) =>
      store.write(() => firstValueFrom(api.patch(apiRoutes.serviceById(id), body))),
    remove: (id: string) =>
      store.write(() => firstValueFrom(api.delete(apiRoutes.serviceById(id)))),
  })),
);
