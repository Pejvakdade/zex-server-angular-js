/** ---------------------------------------------------------------------------------------------------------------------
 * @file customer-options.ts
 * @fileOverview the "Customer" select shared by the Services / Billing modals: every CLIENT account
 *               as a value/label option, fetched once per page visit.
 */
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { Paginated } from '@src/store/admin/admin-users.store';
import { PublicUser } from '@src/store/website/auth.store';

import { SelectOption } from './admin-ui';

export const customerLabel = (user?: PublicUser | null): string =>
  user ? (user.company ? `${user.company} — ${user.fullName}` : user.fullName) : '—';

@Injectable({ providedIn: 'root' })
export class CustomerOptions {
  private readonly api = inject(ApiService);

  readonly options = signal<Array<SelectOption>>([]);

  async load(): Promise<void> {
    const page = await firstValueFrom(
      this.api.get<Paginated<PublicUser>>(`${apiRoutes.user}?userType=client&limit=100`),
    );
    this.options.set(page.docs.map((user) => ({ value: user._id, label: customerLabel(user) })));
  }
}
