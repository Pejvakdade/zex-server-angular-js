/** ---------------------------------------------------------------------------------------------------------------------
 * @file login.ts
 * @fileOverview ported near-verbatim from ../ZexServerAdditionalPages/Log In.dc.html. The markup, inline
 *               styles and copy are the reference's; the form, error state and submit are ours.
 */
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { AuthStore } from '@src/store/website/auth.store';

@Component({
  selector: 'zx-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: '../_component/auth.css',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly store = inject(AuthStore);
  protected readonly routes = appRoutes;
  protected readonly showPw = signal(false);

  protected readonly highlights = [
    '99.9% network uptime guarantee',
    '24/7 expert support, real people',
    '8 global datacenter locations',
  ];

  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    keepLoggedIn: [false],
  });

  protected togglePw(): void {
    this.showPw.update((shown) => !shown);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, keepLoggedIn } = this.form.getRawValue();
    const signedIn = await this.store.signIn(email, password, keepLoggedIn);

    if (!signedIn) return;

    // Staff land in the dashboard; customers land on the site. The customer panel arrives in phase 6.
    await this.router.navigateByUrl(this.store.isStaff() ? appRoutes.AdminDashboard : appRoutes.Home);
  }
}
