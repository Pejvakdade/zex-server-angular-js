/** ---------------------------------------------------------------------------------------------------------------------
 * @file api.service.ts
 * @fileOverview thin HttpClient wrapper that unwraps the backend's response envelope, so callers get
 *               the `result` payload rather than the envelope. Paths come from @src/common/apiRoutes.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiEnvelope } from './apiEnvelope';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  get<TResult>(path: string): Observable<TResult> {
    return this.http.get<ApiEnvelope<TResult>>(path).pipe(map((response) => response.result));
  }

  post<TResult>(path: string, body: unknown): Observable<TResult> {
    return this.http.post<ApiEnvelope<TResult>>(path, body).pipe(map((response) => response.result));
  }

  patch<TResult>(path: string, body: unknown): Observable<TResult> {
    return this.http.patch<ApiEnvelope<TResult>>(path, body).pipe(map((response) => response.result));
  }

  delete<TResult>(path: string): Observable<TResult> {
    return this.http.delete<ApiEnvelope<TResult>>(path).pipe(map((response) => response.result));
  }
}
