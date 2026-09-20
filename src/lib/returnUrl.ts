/** ---------------------------------------------------------------------------------------------------------------------
 * @file returnUrl.ts
 * @fileOverview the `?returnUrl=` handshake between "Choose This Plan" and the auth pages. Only
 *               in-app customer-panel paths are honoured, so the parameter can never bounce someone
 *               to another site.
 */
import { ActivatedRoute } from '@angular/router';

import appRoutes from '@src/common/appRoutes';

export const safeReturnUrl = (value: string | null | undefined): string | null =>
  value && value.startsWith(`${appRoutes.Account}/`) ? value : null;

export const readReturnUrl = (route: ActivatedRoute): string | null =>
  safeReturnUrl(route.snapshot.queryParamMap.get('returnUrl'));
