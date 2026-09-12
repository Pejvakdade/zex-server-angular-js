/** ---------------------------------------------------------------------------------------------------------------------
 * @file auth.store.ts
 * @fileOverview signed-in identity for the whole app. The JWT lives in the `zexUserToken` cookie so the
 *               interceptor can read it on every request; this store mirrors it plus the user record.
 */
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import apiRoutes from '@src/common/apiRoutes';
import { ApiService } from '@src/lib/api.service';
import { readError } from '@src/lib/readError';
import { TOKEN_COOKIE, clearCookie, getCookie, setCookie } from '@src/lib/cookie';

export type UserType = 'admin' | 'staff' | 'client';

export interface PublicUser {
  _id: string;
  fullName: string;
  email: string;
  company?: string | null;
  userType: UserType;
  status: 'Active' | 'Suspended';
}

interface AuthResult {
  token: string;
  user: PublicUser;
}

type AuthState = {
  user: PublicUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

/** Seeded from the cookie so a page reload does not look like a logout before `restore()` lands. */
const initialState: AuthState = {
  user: null,
  token: typeof document === 'undefined' ? null : getCookie(TOKEN_COOKIE),
  loading: false,
  error: null,
};

/** The API returns `message` as a string for our own errors and as a string[] for ValidationPipe ones. */

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ token, user }) => ({
    isAuthenticated: computed(() => !!token()),
    isStaff: computed(() => user()?.userType === 'admin' || user()?.userType === 'staff'),
  })),
  withMethods((store, api = inject(ApiService)) => {
    const persist = ({ token, user }: AuthResult, keepLoggedIn: boolean): void => {
      // Match the backend's two JWT lifetimes so the cookie never outlives the token it carries.
      setCookie(TOKEN_COOKIE, token, keepLoggedIn ? 60 * 60 * 24 * 7 : 60 * 60);
      patchState(store, { token, user, loading: false, error: null });
    };

    return {
      async signIn(email: string, password: string, keepLoggedIn = false): Promise<boolean> {
        patchState(store, { loading: true, error: null });
        try {
          const result = await firstValueFrom(
            api.post<AuthResult>(apiRoutes.signIn, { email, password, keepLoggedIn }),
          );
          persist(result, keepLoggedIn);
          return true;
        } catch (error) {
          patchState(store, { loading: false, error: readError(error) });
          return false;
        }
      },

      async signUp(fullName: string, email: string, password: string): Promise<boolean> {
        patchState(store, { loading: true, error: null });
        try {
          const result = await firstValueFrom(
            api.post<AuthResult>(apiRoutes.signUp, { fullName, email, password }),
          );
          persist(result, false);
          return true;
        } catch (error) {
          patchState(store, { loading: false, error: readError(error) });
          return false;
        }
      },

      /** Rehydrates `user` from the cookie's token on app start or a hard reload. */
      async restore(): Promise<void> {
        if (!store.token() || store.user()) return;
        try {
          const user = await firstValueFrom(api.get<PublicUser>(apiRoutes.me));
          patchState(store, { user });
        } catch {
          // A rejected token is already cleared by the interceptor's 401 branch.
          patchState(store, { token: null, user: null });
        }
      },

      /** Settings saved a new name/email — swap the cached record without another `/me` round trip. */
      setUser(user: PublicUser): void {
        patchState(store, { user });
      },

      signOut(): void {
        clearCookie(TOKEN_COOKIE);
        patchState(store, { token: null, user: null, error: null });
      },

      clearError(): void {
        patchState(store, { error: null });
      },
    };
  }),
);
