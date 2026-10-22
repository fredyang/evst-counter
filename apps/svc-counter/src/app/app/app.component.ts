import { Component, inject } from '@angular/core';
import { CounterService } from '../counter/counter.service';
import { Counter } from '../counter/counter.component';

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
  private readonly counter = inject(CounterService);
  protected restore(): void {
    this.counter.restore();
  }
}
