/** ---------------------------------------------------------------------------------------------------------------------
 * @file metric.pipe.ts
 * @fileOverview renders a `number | null` metric, showing the placeholder when the backend has no
 *               data source for it yet. Keeps the "never invent a number" rule in one place.
 */
import { Pipe, PipeTransform } from '@angular/core';

import { PLACEHOLDER } from '@src/store/website/fleet-stats.store';

@Pipe({ name: 'metric' })
export class MetricPipe implements PipeTransform {
  /**
   * @param value  the metric, or null when it has no source yet
   * @param suffix appended only when there is a real value (e.g. '%')
   */
  transform(value: number | null | undefined, suffix = ''): string {
    return value === null || value === undefined ? PLACEHOLDER : `${value}${suffix}`;
  }
}
