import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from './footer';
import { Navbar } from './navbar';

/** Public storefront shell: the shared navbar and footer wrap every website route. */
@Component({
  selector: 'zx-website-layout',
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <zx-navbar />
    <main>
      <router-outlet />
    </main>
    <zx-footer />
  `,
})
export class WebsiteLayout {}
