import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { counterActions } from './counter.actions';
import { counterEvst } from './counter.feature';
import { ApiService } from '@ng-shared';

export const restoreCounter = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) => {
    return actions$.pipe(
      ofType(counterActions.restore),
      switchMap(() => api.restoreCounter()),
      map((count) => counterActions.setCount({ count })),
      catchError(() => of(counterActions.reset())),
    );
  },
  { functional: true },
);

export const backupCounter = createEffect(
  (actions$ = inject(Actions), store = inject(Store), api = inject(ApiService)) => {
    return actions$.pipe(
      ofType(counterActions.backup),
      withLatestFrom(store.select(counterEvst.views.count), store.select(counterEvst.views.error)),
      tap(([, , error]) => {
        if (error) {
          alert(`Cannot back up the counter: ${error}`);
        }
      }),
      filter(([, , error]) => !error),
      switchMap(([, count]) => api.saveCounter(count)),
      tap(() => {
        alert('Counter backup completed successfully.');
      }),
      catchError((_, caught) => {
        alert('Backing up the counter failed.');
        return caught;
      }),
    );
  },
  { functional: true, dispatch: false },
);
