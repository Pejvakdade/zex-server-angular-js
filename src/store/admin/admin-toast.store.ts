/** ---------------------------------------------------------------------------------------------------------------------
 * @file admin-toast.store.ts
 * @fileOverview the reference's `flashToast(msg)`: one message at a time, cleared after 2.4 s.
 */
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

const TOAST_MS = 2400;

export const AdminToastStore = signalStore(
  { providedIn: 'root' },
  withState<{ message: string | null }>({ message: null }),
  withMethods((store) => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    return {
      flash(message: string): void {
        patchState(store, { message });
        clearTimeout(timer);
        timer = setTimeout(() => patchState(store, { message: null }), TOAST_MS);
      },
    };
  }),
);
