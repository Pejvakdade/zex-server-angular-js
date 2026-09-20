/** ---------------------------------------------------------------------------------------------------------------------
 * @file license-card.ts
 * @fileOverview one software-licence card — the reference's Software Licenses card (icon, name,
 *               blurb, ✓ features, From/price, "Install License" toggle) shared by the licences
 *               page and the control-panel picker on Dedicated Servers. The footer CTA is projected
 *               so each page brings its own ("Order License" vs. "Select panel").
 *
 * @note In `selectable` mode the whole card is a button: clicking it emits `select`, and the
 *       selected card gets the blue outline from the reference screenshot.
 */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { License } from '@src/store/website/licenses.store';

@Component({
  selector: 'zx-license-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './license-card.html',
  styleUrl: './license-card.css',
  host: {
    '[class.selectable]': 'selectable()',
    '[class.selected]': 'selected()',
    '(click)': 'onCardClick()',
  },
})
export class LicenseCard {
  readonly license = input.required<License>();
  /** Whether the visitor has opted into the one-off install fee. */
  readonly installing = input(false);
  /** Picker mode: the card acts as a radio option. */
  readonly selectable = input(false);
  readonly selected = input(false);

  readonly select = output<License>();
  readonly toggleInstall = output<License>();

  /** First month including the install fee, when opted in. */
  protected total(): string {
    const license = this.license();
    const total = this.installing() ? license.price + license.installFee : license.price;
    return total.toFixed(2);
  }

  protected onCardClick(): void {
    if (this.selectable()) this.select.emit(this.license());
  }

  protected onToggle(event: Event): void {
    // The toggle sits inside the card; don't let it double as a select/deselect click.
    event.stopPropagation();
    this.toggleInstall.emit(this.license());
  }
}
