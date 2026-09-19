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
  // Footer sits at the viewport bottom even while a page is still loading or is short.
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      main {
        flex: 1;
      }
    `,
  ],
})
export class WebsiteLayout {}
