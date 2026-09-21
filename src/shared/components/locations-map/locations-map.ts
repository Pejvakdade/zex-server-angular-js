/** ---------------------------------------------------------------------------------------------------------------------
 * @file locations-map.ts
 * @fileOverview the "Global Locations" world map — the native replacement for the reference's D3
 *               <iframe> (../ZexServerAdditionalPages/locations-map.html). Land comes pre-baked from
 *               world-land.ts; markers are projected from whatever locations the API returns, so the map
 *               never disagrees with the cards beneath it.
 *
 * @note Locations without coordinates are skipped silently — every seeded datacenter has them, and the
 *       admin form asks for them on new ones.
 */
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { BORDERS_PATH, LAND_PATH, WORLD_HEIGHT, WORLD_PROJECTION, WORLD_WIDTH } from './world-land';

export interface MapLocation {
  city: string;
  latitude: number | null;
  longitude: number | null;
}

interface Marker {
  city: string;
  x: number;
  y: number;
  /** label offset + anchor, so neighbouring European cities don't overprint each other */
  dx: number;
  dy: number;
  anchor: 'start' | 'middle' | 'end';
  delay: string;
}

/** Same trick as the reference: hand-placed label offsets for the cities that sit on top of each other. */
const LABEL_OFFSETS: Record<string, Pick<Marker, 'dx' | 'dy' | 'anchor'>> = {
  London: { dx: -14, dy: 5, anchor: 'end' },
  Amsterdam: { dx: -10, dy: -20, anchor: 'end' },
  Frankfurt: { dx: 16, dy: 24, anchor: 'start' },
  Helsinki: { dx: 14, dy: -8, anchor: 'start' },
};
const DEFAULT_OFFSET: Pick<Marker, 'dx' | 'dy' | 'anchor'> = { dx: 0, dy: -14, anchor: 'middle' };

/** d3-geo's Mercator, using the scale / translate the generator fitted. */
function project(latitude: number, longitude: number): [number, number] {
  const λ = (longitude * Math.PI) / 180;
  const φ = (latitude * Math.PI) / 180;
  const { scale, tx, ty } = WORLD_PROJECTION;
  return [scale * λ + tx, scale * -Math.log(Math.tan(Math.PI / 4 + φ / 2)) + ty];
}

@Component({
  selector: 'zx-locations-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './locations-map.html',
  styleUrl: './locations-map.css',
})
export class LocationsMap {
  readonly locations = input.required<Array<MapLocation>>();
  /** The city currently used as a plan filter, if any — its marker is drawn highlighted. */
  readonly selected = input<string | null>(null);
  /** Emits the clicked marker's city; the page decides what to do with it. */
  readonly select = output<string>();

  protected readonly width = WORLD_WIDTH;
  protected readonly height = WORLD_HEIGHT;
  protected readonly landPath = LAND_PATH;
  protected readonly bordersPath = BORDERS_PATH;

  protected readonly markers = computed<Array<Marker>>(() =>
    this.locations()
      .filter((l) => l.latitude != null && l.longitude != null)
      .map((l) => {
        const [x, y] = project(l.latitude!, l.longitude!);
        return { city: l.city, x, y, ...(LABEL_OFFSETS[l.city] ?? DEFAULT_OFFSET), delay: '0s' };
      })
      .sort((a, b) => a.x - b.x)
      .map((m, i) => ({ ...m, delay: `${(i * 0.4).toFixed(1)}s` })),
  );

  /** Dashed arcs chaining the markers west → east, bowed upward like the reference. */
  protected readonly arcs = computed<Array<string>>(() => {
    const pts = this.markers();
    return pts.slice(1).map((b, i) => {
      const a = pts[i];
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2 - Math.hypot(b.x - a.x, b.y - a.y) * 0.22;
      return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`;
    });
  });

  /** Leader line end for side-anchored labels. */
  protected leaderX(m: Marker): number {
    return m.anchor === 'end' ? m.dx + 6 : m.dx - 6;
  }
}
