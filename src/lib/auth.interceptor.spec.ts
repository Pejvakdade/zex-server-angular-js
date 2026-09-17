import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import appRoutes from '@src/common/appRoutes';
import { environment } from '@src/environments/environment';

import { authInterceptor } from './auth.interceptor';
import { TOKEN_COOKIE, clearCookie, getCookie, setCookie } from './cookie';

describe('authInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let router: { url: string; navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { url: '/', navigateByUrl: vi.fn().mockResolvedValue(true) };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    clearCookie(TOKEN_COOKIE);
  });

  afterEach(() => {
    backend.verify();
    clearCookie(TOKEN_COOKIE);
  });

  it('prefixes a relative path with the API base URL (leading slash or not)', () => {
    http.get('plan').subscribe();
    http.get('/plan').subscribe();

    const requests = backend.match(`${environment.baseUrl}/plan`);
    expect(requests).toHaveLength(2);
    requests.forEach((request) => request.flush({}));
  });

  it('leaves an absolute URL alone', () => {
    http.get('https://example.com/ping').subscribe();

    backend.expectOne('https://example.com/ping').flush({});
  });

  it('attaches the cookie token as a Bearer header, and nothing when signed out', () => {
    http.get('a').subscribe();
    expect(backend.expectOne(`${environment.baseUrl}/a`).request.headers.has('Authorization')).toBe(false);

    setCookie(TOKEN_COOKIE, 'jwt-123');
    http.get('b').subscribe();
    expect(backend.expectOne(`${environment.baseUrl}/b`).request.headers.get('Authorization')).toBe(
      'Bearer jwt-123',
    );
  });

  it('on a 401 clears the token and sends the website user to /login', async () => {
    setCookie(TOKEN_COOKIE, 'stale');
    router.url = '/account/services';

    const pending = firstValueFrom(http.get('user/me'));
    backend.expectOne(`${environment.baseUrl}/user/me`).flush({}, { status: 401, statusText: 'Unauthorized' });

    await expect(pending).rejects.toMatchObject({ status: 401 });
    expect(getCookie(TOKEN_COOKIE)).toBeNull();
    expect(router.navigateByUrl).toHaveBeenCalledWith(appRoutes.Login);
  });

  it('on a 401 inside /admin redirects to the admin login instead', async () => {
    router.url = '/admin/customers';

    const pending = firstValueFrom(http.get('user'));
    backend.expectOne(`${environment.baseUrl}/user`).flush({}, { status: 401, statusText: 'Unauthorized' });

    await expect(pending).rejects.toMatchObject({ status: 401 });
    expect(router.navigateByUrl).toHaveBeenCalledWith(appRoutes.AdminLogin);
  });

  it('lets other errors through untouched', async () => {
    const pending = firstValueFrom(http.get('plan'));
    backend.expectOne(`${environment.baseUrl}/plan`).flush({}, { status: 500, statusText: 'Server Error' });

    await expect(pending).rejects.toMatchObject({ status: 500 });
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
