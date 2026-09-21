/** ---------------------------------------------------------------------------------------------------------------------
 * @file toast.ts
 * @fileOverview the reference's bottom-right toast, bound to AdminToastStore.
 */
import { Component, inject } from '@angular/core';

import { AdminToastStore } from '@src/store/admin/admin-toast.store';

@Component({
  selector: 'zx-toast',
  template: `
    @if (toast.message(); as message) {
      <div
        style="position:fixed;bottom:28px;right:28px;background:#0B0B2E;color:var(--zx-on-accent);padding:14px 20px;border-radius:12px;font-size:13.5px;box-shadow:0 14px 32px rgba(10,10,40,0.3);z-index:200;"
      >
        {{ message }}
      </div>
    }
  `,
})
export class Toast {
  protected readonly toast = inject(AdminToastStore);
}
