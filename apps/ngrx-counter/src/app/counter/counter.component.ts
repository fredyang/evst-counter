import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { counterActions } from './store/counter.actions';
import { counterFeature } from './store/counter.feature';
import { analyticAction } from './analytic.effect';

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
  private readonly store = inject(Store);
  protected readonly count = this.store.selectSignal(counterFeature.selectCount);
  protected readonly error = this.store.selectSignal(counterFeature.selectError);

  ngOnInit(): void {
    this.store.dispatch(counterActions.restore());
    this.store.dispatch(analyticAction.track({ eventName: 'restore' }));
  }
  protected increment(): void {
    this.store.dispatch(counterActions.increment());
    this.store.dispatch(analyticAction.track({ eventName: 'increment' }));
  }

  protected decrement(): void {
    this.store.dispatch(counterActions.decrement());
    this.store.dispatch(analyticAction.track({ eventName: 'decrement' }));
  }

  protected restore(): void {
    this.store.dispatch(counterActions.restore());
    this.store.dispatch(analyticAction.track({ eventName: 'restore' }));
  }

  protected backup(): void {
    this.store.dispatch(counterActions.backup());
    this.store.dispatch(analyticAction.track({ eventName: 'backup' }));
  }
}
