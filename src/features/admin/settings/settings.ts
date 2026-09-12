/** ---------------------------------------------------------------------------------------------------------------------
 * @file settings.ts
 * @fileOverview Settings: the reference's "Admin account" card (name, email) plus a password change,
 *               saved through PATCH /user/me. The auth store's cached user is refreshed on success
 *               so the topbar name updates without a reload.
 */
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';
import { AuthStore, PublicUser } from '@src/store/website/auth.store';

import { UI } from '../_component/admin-ui';

@Component({
  selector: 'zx-admin-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
})
export class Settings {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(AdminToastStore);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly ui = UI;
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    fullName: [this.auth.user()?.fullName ?? '', [Validators.required, Validators.minLength(2)]],
    email: [this.auth.user()?.email ?? '', [Validators.required, Validators.email]],
    currentPassword: [''],
    newPassword: ['', [Validators.minLength(8)]],
  });

  protected async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, email, currentPassword, newPassword } = this.form.getRawValue();
    const body: Record<string, string> = { fullName, email };
    if (newPassword) Object.assign(body, { currentPassword, newPassword });

    this.saving.set(true);
    this.error.set(null);
    try {
      const user = await firstValueFrom(this.api.patch<PublicUser>(apiRoutes.me, body));
      this.auth.setUser(user);
      this.form.patchValue({ currentPassword: '', newPassword: '' });
      this.toast.flash('Settings saved');
    } catch (err) {
      this.error.set(readError(err));
    } finally {
      this.saving.set(false);
    }
  }
}
