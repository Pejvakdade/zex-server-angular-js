/** ---------------------------------------------------------------------------------------------------------------------
 * @file site-contact.ts
 * @fileOverview Contact Us = the page editor plus the inbox of contact-form submissions.
 */
import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
  AdminContactMessagesStore,
  ContactMessage,
  MessageStatus,
} from '@src/store/admin/admin-contact-messages.store';
import { AdminToastStore } from '@src/store/admin/admin-toast.store';

import { ConfirmDialog } from '../_component/confirm-dialog';
import { UI, pill } from '../_component/admin-ui';
import { SitePage } from './site-page';

const STATUSES: ReadonlyArray<MessageStatus> = ['New', 'Read', 'Archived'];

@Component({
  selector: 'zx-site-contact',
  imports: [SitePage, ConfirmDialog, DatePipe],
  templateUrl: './site-contact.html',
})
export class SiteContact {
  protected readonly inbox = inject(AdminContactMessagesStore);
  private readonly toast = inject(AdminToastStore);

  protected readonly ui = UI;
  protected readonly pill = pill;
  protected readonly statuses = STATUSES;
  protected readonly deleting = signal<ContactMessage | null>(null);
  protected readonly expanded = signal<string | null>(null);

  protected readonly tint = computed(
    () => (status: MessageStatus) =>
      status === 'New' ? 'blue' : status === 'Read' ? 'green' : 'neutral',
  );

  constructor() {
    void this.inbox.load();
  }

  protected filter(status: MessageStatus | null): void {
    this.inbox.setStatusFilter(status);
    void this.inbox.load();
  }

  protected async mark(message: ContactMessage, status: MessageStatus): Promise<void> {
    if (await this.inbox.setStatus(message._id, status))
      this.toast.flash(`Marked ${status.toLowerCase()}`);
  }

  protected async confirmDelete(): Promise<void> {
    const message = this.deleting();
    if (!message) return;
    if (await this.inbox.remove(message._id)) {
      this.deleting.set(null);
      this.toast.flash('Message deleted');
    }
  }

  protected toggle(id: string): void {
    this.expanded.update((current) => (current === id ? null : id));
  }
}
