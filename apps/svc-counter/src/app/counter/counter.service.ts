import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { AnalyticsService, ApiService } from '@ng-shared';

@Injectable({ providedIn: 'root' })
export class CounterService {
  private readonly api = inject(ApiService);
  private readonly analytics = inject(AnalyticsService);
  private readonly destroyRef = inject(DestroyRef);
  private restoreRequest = new Subscription();
  private backupRequest = new Subscription();

  private readonly currentCount = signal(0);

  readonly count = this.currentCount.asReadonly();
  readonly error = computed(() =>
    this.count() < -9 || this.count() > 9 ? 'Count must be in range -9 to 9.' : '',
  );

  increment(): void {
    this.currentCount.update((count) => count + 1);
    this.analytics.track('increment');
  }

  decrement(): void {
    this.currentCount.update((count) => count - 1);
    this.analytics.track('decrement');
  }

  restore(): void {
    this.restoreRequest.unsubscribe();
    this.restoreRequest = this.api
      .restoreCounter()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (count) => this.currentCount.set(count),
        error: () => this.currentCount.set(0),
      });
    this.analytics.track('restore');
  }

  backup(): void {
    this.backupRequest.unsubscribe();
    const count = this.count();
    if (this.error()) {
      alert(`Cannot back up the counter: ${this.error()}`);
      return;
    }
    this.backupRequest = this.api
      .saveCounter(count)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => alert('Counter backup completed successfully.'),
        error: () => alert('Backing up the counter failed.'),
      });
    this.analytics.track('backup');
  }
}
