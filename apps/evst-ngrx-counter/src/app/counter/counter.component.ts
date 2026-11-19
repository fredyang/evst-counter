import { Component, OnInit } from '@angular/core';
import { counterActions } from './store/counter.actions';
import { counterEvst } from './store/counter.feature';
import { analyticsAction } from '../core/analytics.effect';

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
  protected readonly count = counterEvst.views.count.signal();
  protected readonly error = counterEvst.views.error.signal();

  ngOnInit(): void {
    counterActions.restore.publish();
    analyticsAction.track.publish({ eventName: 'restore' });
  }
  protected increment(): void {
    counterActions.increment.publish();
    analyticsAction.track.publish({ eventName: 'increment' });
  }

  protected decrement(): void {
    counterActions.decrement.publish();
    analyticsAction.track.publish({ eventName: 'decrement' });
  }

  protected restore(): void {
    counterActions.restore.publish();
    analyticsAction.track.publish({ eventName: 'restore' });
  }

  protected backup(): void {
    counterActions.backup.publish();
    analyticsAction.track.publish({ eventName: 'backup' });
  }
}
