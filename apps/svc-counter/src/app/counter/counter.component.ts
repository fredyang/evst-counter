import { Component, inject, OnInit } from '@angular/core';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-counter',
  template: `
    <section aria-labelledby="counter-heading">
      <h1 id="counter-heading">Count</h1>
      <div class="counter-controls">
        <button type="button" aria-label="Decrement counter" (click)="decrement()">−</button>
        <output aria-label="Current count" aria-live="polite" aria-atomic="true">{{
          count()
        }}</output>
        <button type="button" aria-label="Increment counter" (click)="increment()">+</button>
      </div>
      <p class="warning" role="alert">{{ error() }}</p>
      <div class="storage-controls">
        <button
          class="restore-control"
          type="button"
          aria-label="Restore counter"
          title="Restore counter"
          (click)="restore()"
        >
          Restore
        </button>
        <button
          class="backup-control"
          type="button"
          aria-label="Backup counter"
          title="Backup counter"
          (click)="backup()"
        >
          Backup
        </button>
      </div>
    </section>
  `,
  styleUrl: './counter.component.scss',
})
export class Counter implements OnInit {
  private readonly counterService = inject(CounterService);
  protected readonly count = this.counterService.count;
  protected readonly error = this.counterService.error;

  ngOnInit(): void {
    this.restore();
  }
  protected increment(): void {
    this.counterService.increment();
  }

  protected decrement(): void {
    this.counterService.decrement();
  }

  protected restore(): void {
    this.counterService.restore();
  }

  protected backup(): void {
    this.counterService.backup();
  }
}
