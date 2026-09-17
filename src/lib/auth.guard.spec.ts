import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import appRoutes from '@src/common/appRoutes';
import { AuthStore } from '@src/store/website/auth.store';

import { authGuard, clientGuard, guestGuard, staffGuard } from './auth.guard';

type Identity = 'guest' | 'client' | 'staff';

describe('route guards', () => {
  let router: Router;
  const store = { restore: vi.fn(), isAuthenticated: vi.fn(), isStaff: vi.fn() };

  const signedInAs = (identity: Identity) => {
    store.isAuthenticated.mockReturnValue(identity !== 'guest');
    store.isStaff.mockReturnValue(identity === 'staff');
  };

  /** Runs a guard the way the router would and normalises a UrlTree result to its path. */
  const run = async (guard: typeof authGuard): Promise<true | string> => {
    const result = await TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
    return result instanceof UrlTree ? router.serializeUrl(result) : (result as true);
  };

  beforeEach(() => {
    store.restore.mockResolvedValue(undefined);
    TestBed.configureTestingModule({ providers: [{ provide: AuthStore, useValue: store }] });
    router = TestBed.inject(Router);
  });

  it('every guard waits for restore() before deciding', async () => {
    signedInAs('client');
    await run(authGuard);

    expect(store.restore).toHaveBeenCalled();
  });

  it('authGuard / clientGuard: any signed-in account passes, a guest goes to /login', async () => {
    signedInAs('guest');
    expect(await run(authGuard)).toBe(appRoutes.Login);
    expect(await run(clientGuard)).toBe(appRoutes.Login);

    signedInAs('client');
    expect(await run(clientGuard)).toBe(true);

    signedInAs('staff');
    expect(await run(clientGuard)).toBe(true);
  });

  it('staffGuard: guests to the admin login, customers home, staff through', async () => {
    signedInAs('guest');
    expect(await run(staffGuard)).toBe(appRoutes.AdminLogin);

    signedInAs('client');
    expect(await run(staffGuard)).toBe(appRoutes.Home);

    signedInAs('staff');
    expect(await run(staffGuard)).toBe(true);
  });

  it('guestGuard: guests through, signed-in users bounced to their own panel', async () => {
    signedInAs('guest');
    expect(await run(guestGuard)).toBe(true);

    signedInAs('client');
    expect(await run(guestGuard)).toBe(appRoutes.Account);

    signedInAs('staff');
    expect(await run(guestGuard)).toBe(appRoutes.AdminDashboard);
  });
});
