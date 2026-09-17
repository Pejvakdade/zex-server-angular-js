import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let api: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('unwraps the backend envelope and hands back only `result`', async () => {
    const pending = firstValueFrom(api.get<{ postgres: string }>('health'));

    http.expectOne('health').flush({ result: { postgres: 'ok' }, message: 'OK', httpCode: 200, statusCode: 2000 });

    await expect(pending).resolves.toEqual({ postgres: 'ok' });
  });

  it('sends the body on writes and unwraps those too', async () => {
    const pending = firstValueFrom(api.post<{ _id: string }>('ticket', { subject: 'Help' }));
    const request = http.expectOne('ticket');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ subject: 'Help' });
    request.flush({ result: { _id: 't1' } });

    await expect(pending).resolves.toEqual({ _id: 't1' });
  });
});
