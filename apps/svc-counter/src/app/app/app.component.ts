import { Component, inject } from '@angular/core';
import { Counter } from '../counter/counter.component';
import { CounterService } from '../counter/counter.service';
// import { CounterService } from '../counter/counter-signal-store.service';

@Component({
  imports: [Counter],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  template: `
    <header class="top-bar">
      <nav aria-label="Main navigation">
        <a class="brand" href="/">Angular Service</a>

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
  private readonly counterService = inject(CounterService);
  protected restore(): void {
    this.counterService.restore();
  }
}
