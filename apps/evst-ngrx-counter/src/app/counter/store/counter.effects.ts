import { inject } from '@angular/core';
import { catchError, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { counterActions } from './counter.actions';
import { counterEvst } from './counter.feature';
import { ApiService } from '@ng-shared';
import { task } from '@evst/ngrx-store';

export const counterTasks = task((on) => {
  return {
    restoreCounter: on(counterActions.restore, (pipe, api = inject(ApiService)) => {
      return pipe(
        switchMap(() => api.restoreCounter()),
        map((count) => counterActions.setCount({ count })),
        catchError(() => of(counterActions.reset())),
      );
    }),
    backupCounter: on(
      counterActions.backup,
      (pipe, api = inject(ApiService)) => {
        return pipe(
          withLatestFrom(
            counterEvst.views.count.observable(),
            counterEvst.views.error.observable(),
          ),
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
      { dispatch: false },
    ),
  };
});
