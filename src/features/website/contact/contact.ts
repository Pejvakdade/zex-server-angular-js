/** ---------------------------------------------------------------------------------------------------------------------
 * @file contact.ts
 * @fileOverview the Contact Us page, ported from the reference. Copy, channels and business details
 *               come from site-content; the ticket card opens a real support ticket.
 *
 * @note The reference's generic "Send us a message" form is deliberately absent — the three contact
 *       paths are Support Ticket, WhatsApp and Email. Its "Open a Support Ticket" panel is what sits
 *       in the form's place, wired to the ticket API through MyTicketsStore so a ticket opened here is
 *       the same ticket the customer sees in their panel.
 *
 *       Tickets belong to an account (the API requires a signed-in user), so a visitor who isn't
 *       signed in sees the card with Log in / Create account instead of a form that would fail.
 */
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { LineIcon } from '@src/shared/components/line-icon/line-icon';
import { TICKET_PRIORITIES, Ticket, TicketPriority } from '@src/shared/components/ticket/ticket.model';
import { AuthStore } from '@src/store/website/auth.store';
import { MyTicketsStore } from '@src/store/website/my-tickets.store';
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

/** The stored icon is a name from the reference; the line-icon library is keyed by emoji. */
const CHANNEL_EMOJI: Record<string, string> = { mail: '✉️', headset: '🎧', ticket: '🎫' };

@Component({
  selector: 'zx-contact',
  imports: [ReactiveFormsModule, RouterLink, LineIcon],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private readonly formBuilder = inject(FormBuilder);
  private readonly store = inject(SiteContentStore);
  protected readonly auth = inject(AuthStore);
  protected readonly tickets = inject(MyTicketsStore);

  protected readonly routes = appRoutes;
  protected readonly priorities = TICKET_PRIORITIES;
  protected readonly content = computed(() => this.store.forPage()<ContactContent>('contact'));

  /** the ticket just opened from this page, driving the success state */
  protected readonly opened = signal<Ticket | null>(null);
  protected readonly validation = signal<string | null>(null);

  protected readonly inputStyle =
    'padding:12px 14px;border-radius:10px;border:1.5px solid #E0E3F5;font-size:14px;width:100%;box-sizing:border-box;font-family:inherit;color:#161629;outline:none;resize:vertical;background:#fff;';

  /** Mirrors CreateTicketDto so the same rules apply on both sides. */
  protected readonly form = this.formBuilder.nonNullable.group({
    subject: ['', [Validators.required, Validators.minLength(2)]],
    priority: ['Medium' as TicketPriority, Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    void this.store.load('contact');
  }

  protected channelEmoji(icon: string): string {
    return CHANNEL_EMOJI[icon] ?? '✉️';
  }

  /**
   * Email opens a mail client, the phone channel opens a WhatsApp chat (wa.me wants digits only);
   * the ticket card jumps to the ticket form further down the page.
   */
  protected channelHref(channel: Channel): string | null {
    if (channel.icon === 'mail') return `mailto:${channel.value}`;
    if (channel.icon === 'headset') return `https://wa.me/${channel.value.replace(/\D/g, '')}`;
    return null;
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validation.set('Please add a subject and describe the issue in at least 10 characters.');
      return;
    }
    this.validation.set(null);

    const ticket = await this.tickets.open(this.form.getRawValue());
    if (ticket) {
      this.opened.set(ticket);
      this.form.reset({ subject: '', priority: 'Medium', message: '' });
    }
  }
}
