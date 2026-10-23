import { computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Subscription } from 'rxjs';
import { AnalyticsService, ApiService } from '@ng-shared';

interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};

export const CounterService = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ count }) => ({
    error: computed(() => (count() < -9 || count() > 9 ? 'Count must be in range -9 to 9.' : '')),
  })),
  withMethods(
    (
      store,
      api = inject(ApiService),
      analytics = inject(AnalyticsService),
      destroyRef = inject(DestroyRef),
    ) => {
      let restoreRequest = new Subscription();
      let backupRequest = new Subscription();

      return {
        increment(): void {
          patchState(store, ({ count }) => ({ count: count + 1 }));
          analytics.track('increment');
        },

        decrement(): void {
          patchState(store, ({ count }) => ({ count: count - 1 }));
          analytics.track('decrement');
        },

        restore(): void {
          restoreRequest.unsubscribe();
          restoreRequest = api
            .restoreCounter()
            .pipe(takeUntilDestroyed(destroyRef))
            .subscribe({
              next: (count) => patchState(store, { count }),
              error: () => patchState(store, initialState),
            });
          analytics.track('restore');
        },

        backup(): void {
          backupRequest.unsubscribe();
          const count = store.count();
          if (store.error()) {
            alert(`Cannot back up the counter: ${store.error()}`);
            return;
          }
          backupRequest = api
            .saveCounter(count)
            .pipe(takeUntilDestroyed(destroyRef))
            .subscribe({
              next: () => alert('Counter backup completed successfully.'),
              error: () => alert('Backing up the counter failed.'),
            });
          analytics.track('backup');
        },
      };
    },
  ),
);
