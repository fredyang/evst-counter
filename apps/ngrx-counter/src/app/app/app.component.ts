import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Counter } from '../counter/counter.component';
import { counterActions } from '../counter/store/counter.actions';

@Component({
  imports: [Counter],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  template: `
    <header class="top-bar">
      <nav aria-label="Main navigation">
        <a class="brand" href="/">Counter</a>

        <button
          class="restore-button"
          type="button"
          aria-label="Restore counter"
          title="Restore counter"
          (click)="restore()"
        >
          bad guy restore
        </button>
      </nav>
    </header>
    <main>
      <app-counter />
    </main>
  `,
})
export class App {
  store = inject(Store);
  protected restore(): void {
    this.store.dispatch(counterActions.restore());
  }
}
