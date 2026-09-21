/** ---------------------------------------------------------------------------------------------------------------------
 * @file ticket-thread.ts
 * @fileOverview the conversation inside a ticket — the reference's TICKET DETAIL DIALOG body: the
 *               customer's opening message in a grey bubble, replies as right-aligned blue bubbles,
 *               and the reply textarea. Shared by the admin dialog and the customer panel's page;
 *               the wrapper decides the chrome (modal vs page) and the extra actions.
 */
import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Ticket, timeAgo } from './ticket.model';

@Component({
  selector: 'zx-ticket-thread',
  imports: [FormsModule],
  template: `
    <div
      style="overflow-y:auto;flex:1;min-height:0;display:flex;flex-direction:column;gap:14px;padding-right:4px;margin-bottom:16px;"
    >
      <div style="background:var(--zx-surface-muted);border-radius:14px;padding:14px 16px;">
        <div style="font-size:12px;font-weight:700;color:var(--zx-text-muted);margin-bottom:6px;">
          {{ openerName() }} &middot; {{ ago(ticket().createdAt) }}
        </div>
        <div style="font-size:13.5px;color:var(--zx-text);line-height:1.5;white-space:pre-wrap;">
          {{ ticket().message }}
        </div>
      </div>
      @for (r of ticket().replies ?? []; track r._id) {
        <div [style]="r.authorType === 'staff' ? staffBubble : customerBubble">
          <div
            [style.color]="r.authorType === 'staff' ? 'var(--zx-primary)' : 'var(--zx-text-muted)'"
            style="font-size:12px;font-weight:700;margin-bottom:6px;"
          >
            {{ r.authorName }} &middot; {{ ago(r.createdAt) }}
          </div>
          <div style="font-size:13.5px;color:var(--zx-text);line-height:1.5;white-space:pre-wrap;">
            {{ r.text }}
          </div>
        </div>
      }
    </div>

    @if (ticket().status !== 'Closed') {
      <textarea
        [(ngModel)]="draft"
        name="reply"
        [placeholder]="placeholder()"
        rows="3"
        style="width:100%;box-sizing:border-box;resize:vertical;border:1.5px solid var(--zx-border);border-radius:12px;padding:12px 14px;font-size:13.5px;font-family:inherit;color:var(--zx-ink);margin-bottom:14px;"
      ></textarea>
    } @else {
      <div
        style="font-size:13px;color:var(--zx-text-faint);background:var(--zx-surface-muted);border-radius:10px;padding:10px 14px;margin-bottom:14px;"
      >
        This ticket is closed.
      </div>
    }

    @if (error()) {
      <div
        style="font-size:13px;color:var(--zx-red-fg);background:var(--zx-red-tint);border:1px solid var(--zx-red-border);border-radius:10px;padding:10px 12px;margin-bottom:14px;"
      >
        {{ error() }}
      </div>
    }

    <div
      style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;"
    >
      <ng-content />
      <button
        type="button"
        (click)="send()"
        [disabled]="saving() || ticket().status === 'Closed' || !draft.trim()"
        [style.opacity]="ticket().status === 'Closed' || !draft.trim() ? 0.5 : 1"
        style="padding:10px 20px;border-radius:10px;border:none;background:#161629;color:var(--zx-on-accent);font-weight:700;font-size:13px;cursor:pointer;margin-left:auto;"
      >
        {{ saving() ? 'Sending…' : 'Send reply' }}
      </button>
    </div>
  `,
})
export class TicketThread {
  readonly ticket = input.required<Ticket>();
  readonly saving = input(false);
  readonly error = input<string | null>(null);
  /** "Write a reply to the customer..." on the desk, "Write a reply..." in the panel. */
  readonly placeholder = input('Write a reply...');

  readonly reply = output<string>();

  protected draft = '';
  protected readonly ago = timeAgo;
  protected readonly staffBubble =
    'align-self:flex-end;max-width:88%;background:var(--zx-surface-mine);border-radius:14px;padding:14px 16px;';
  protected readonly customerBubble =
    'align-self:flex-start;max-width:88%;background:var(--zx-surface-muted);border-radius:14px;padding:14px 16px;';

  constructor() {
    // The draft clears once the reply actually lands (the thread grows); a failed send keeps the text.
    effect(() => {
      this.ticket().replies?.length;
      this.draft = '';
    });
  }

  protected openerName(): string {
    const customer = this.ticket().customer;
    return customer ? customer.company || customer.fullName : 'Customer';
  }

  protected send(): void {
    const text = this.draft.trim();
    if (!text) return;
    this.reply.emit(text);
  }
}
