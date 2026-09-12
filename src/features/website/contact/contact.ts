/** ---------------------------------------------------------------------------------------------------------------------
 * @file contact.ts
 * @fileOverview the Contact Us page, ported from the reference. Copy and channels come from
 *               site-content; the form posts to the contact-message endpoint.
 *
 * @note The reference's form is inert — a static mockup with nowhere to submit. Here it really
 *       stores a message, because a form that looks like it sends and does not is worse than no
 *       form at all.
 *
 *       The reference also has a second "Open a Ticket" form (subject / priority / message). That
 *       is not ported: tickets need the ticket feature, which arrives in phase 6. The Support
 *       Ticket channel links to the Support page meanwhile.
 */
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import appRoutes from '@src/common/appRoutes';
import { ApiService } from '@src/lib/api.service';
import { SiteContentStore } from '@src/store/website/site-content.store';

interface Channel {
  label: string;
  description: string;
  value: string;
  icon: string;
}

interface ContactContent {
  heroHeading: string;
  heroSubheading: string;
  businessName: string;
  businessWebsite: string;
  businessAddress: string;
  salesHours: string;
  faqTeaserHeading: string;
  faqTeaserSubheading: string;
  socialLinks: Array<{ label: string; url: string; icon: string }>;
  channels: Array<Channel>;
}

@Component({
  selector: 'zx-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly store = inject(SiteContentStore);

  protected readonly routes = appRoutes;
  protected readonly content = computed(() => this.store.forPage()<ContactContent>('contact'));

  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly inputStyle =
    'padding:12px 14px;border-radius:10px;border:1.5px solid #E0E3F5;font-size:14px;width:100%;box-sizing:border-box;font-family:inherit;color:#161629;outline:none;resize:vertical;';

  /** Mirrors the backend DTO so the same rules apply on both sides. */
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(2)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    void this.store.load('contact');
  }

  /** The reference draws these as emoji; the stored icon names map onto the same glyphs. */
  protected channelGlyph(icon: string): string {
    return { mail: '✉', headset: '📱', ticket: '🎫' }[icon] ?? '✉';
  }

  /** Email and phone channels get real mailto:/tel: links; anything else routes to Support. */
  protected channelHref(channel: Channel): string | null {
    if (channel.icon === 'mail') return `mailto:${channel.value}`;
    if (channel.icon === 'headset') return `tel:${channel.value.replace(/[^\d+]/g, '')}`;
    return null;
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Please fill in every field — the message needs at least 10 characters.');
      return;
    }

    this.sending.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.api.post(apiRoutes.contactMessage, this.form.getRawValue()));
      this.sent.set(true);
    } catch (caught) {
      const message = (caught as HttpErrorResponse)?.error?.message;
      this.error.set(
        Array.isArray(message)
          ? message[0]
          : message || 'Could not send your message. Please try again.',
      );
    } finally {
      this.sending.set(false);
    }
  }
}
