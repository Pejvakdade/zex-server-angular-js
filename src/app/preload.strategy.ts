/** ---------------------------------------------------------------------------------------------------------------------
 * @file preload.strategy.ts
 * @fileOverview preloads only the lazy routes flagged `data: { preload: true }`. The public website is
 *               flagged so its product / licenses / map chunks arrive in the background right after
 *               first paint; the admin and customer bundles stay lazy so anonymous visitors never
 *               download them.
 */
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectivePreload implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data?.['preload'] ? load() : of(null);
  }
}
