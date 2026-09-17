/** ---------------------------------------------------------------------------------------------------------------------
 * @file get-started.ts
 * @fileOverview ported near-verbatim from ../ZexServerAdditionalPages/Get Started.dc.html.
 */
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { AuthStore } from '@src/store/website/auth.store';
import { FleetStatsStore, PLACEHOLDER } from '@src/store/website/fleet-stats.store';

@Component({
  selector: 'zx-get-started',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './get-started.html',
  styleUrl: '../_component/auth.css',
})
export class GetStarted implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly store = inject(AuthStore);
  protected readonly stats = inject(FleetStatsStore);
  protected readonly routes = appRoutes;
  protected readonly showPw = signal(false);

  /** No figures in these three - they are product claims, so they stay as copy. */
  protected readonly highlights = computed(() => [
    'Deploy VPS, Web & WordPress hosting in minutes',
    'No long-term contracts, cancel anytime',
    'Free migration from your current host',
  ]);

  /** A count of real rows, so it shows a placeholder until the location table exists (phase 3). */
  protected readonly locationCount = computed(() => this.stats.stats().locations ?? PLACEHOLDER);

  protected readonly form = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    // Mirrors the backend DTO's MinLength(8), so the 8-char rule is enforced on both sides.
    password: ['', [Validators.required, Validators.minLength(8)]],
    acceptedTerms: [false, [Validators.requiredTrue]],
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

    const { fullName, email, password } = this.form.getRawValue();

    if (await this.store.signUp(fullName, email, password)) {
      await this.router.navigateByUrl(appRoutes.Account);
    }
  }
}
