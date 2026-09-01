import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Admin dashboard shell. The 17-item sidebar from the reference lands here in phase 5. */
@Component({
  selector: 'zx-admin-layout',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AdminLayout {}
