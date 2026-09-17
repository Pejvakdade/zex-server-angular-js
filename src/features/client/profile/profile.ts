/** ---------------------------------------------------------------------------------------------------------------------
 * @file profile.ts
 * @fileOverview Profile: the admin Settings card (name / email / password via PATCH /user/me), which
 *               is exactly what a customer needs too — only the heading differs.
 */
import { Component } from '@angular/core';

import { Settings } from '@src/features/admin/settings/settings';

@Component({
  selector: 'zx-client-profile',
  imports: [Settings],
  template: `<zx-admin-settings heading="Your account" />`,
})
export class Profile {}
