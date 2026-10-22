import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, timer, withLatestFrom } from 'rxjs';
import { counterActions } from './counter.actions';
import { counterFeature } from './counter.feature';
import { ApiService } from '../../core/api.service';

export const resetCounterPristine = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) => {
    return actions$.pipe(
      ofType(counterActions.restore),
      switchMap(() => api.restoreCounter()),
      map((count) => counterActions.setCount({ count })),
      catchError(() => of(counterActions.resetToInitial())),
    );
  },
  { functional: true },
);

export const backupCounter = createEffect(
  (actions$ = inject(Actions), store = inject(Store), api = inject(ApiService)) => {
    return actions$.pipe(
      ofType(counterActions.backup),
      withLatestFrom(store.select(counterFeature.selectCount)),
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
