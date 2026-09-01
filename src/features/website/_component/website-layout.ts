import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Public storefront shell. Navbar/footer land here in phase 4. */
@Component({
  selector: 'zx-website-layout',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class WebsiteLayout {}
