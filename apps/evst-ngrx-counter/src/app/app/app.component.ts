import { Component } from '@angular/core';
import { Counter } from '../counter/counter.component';
import { fromTopBar } from '../counter/store/counter.events';

@Component({
  imports: [Counter],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  template: `
    <header class="top-bar">
      <nav aria-label="Main navigation">
        <a class="brand" href="/">EVST for NgRx Store</a>

        <button
          class="restore-button"
          type="button"
          aria-label="Restore counter"
          title="Restore counter"
          (click)="restore()"
        >
          Another restore
        </button>
      </nav>
    </header>
    <main>
      <app-counter />
    </main>
  `,
})
export class App {
  protected restore(): void {
    fromTopBar.restoreClicked.publish();
  }
}
