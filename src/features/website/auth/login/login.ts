/** ---------------------------------------------------------------------------------------------------------------------
 * @file login.ts
 * @fileOverview ported near-verbatim from ../ZexServerAdditionalPages/Log In.dc.html. The markup, inline
 *               styles and copy are the reference's; the form, error state and submit are ours.
 */
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { MetricPipe } from '@src/lib/metric.pipe';
import { AuthStore } from '@src/store/website/auth.store';
import { FleetStatsStore, PLACEHOLDER } from '@src/store/website/fleet-stats.store';

@Component({
  selector: 'zx-login',
  imports: [ReactiveFormsModule, RouterLink, MetricPipe],
  templateUrl: './login.html',
  styleUrl: '../_component/auth.css',
})
export class Login implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly store = inject(AuthStore);
  protected readonly stats = inject(FleetStatsStore);
  protected readonly routes = appRoutes;
  protected readonly showPw = signal(false);

  /**
   * The first two are contractual marketing claims, not measurements, so they stay as copy.
   * The third is a count of real rows, so it comes from the API and shows a placeholder until the
   * location table exists (phase 3) rather than repeating the reference's invented "8".
   */
  protected readonly highlights = computed(() => [
    '99.9% network uptime guarantee',
    '24/7 expert support, real people',
    `${this.stats.stats().locations ?? PLACEHOLDER} global datacenter locations`,
  ]);

  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    keepLoggedIn: [false],
  });

  ngOnInit(): void {
    void this.stats.load();
  }

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
    await this.router.navigateByUrl(
      this.store.isStaff() ? appRoutes.AdminDashboard : appRoutes.Home,
    );
  }
}
