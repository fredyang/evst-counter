import { inject } from '@angular/core';
import { ApiService } from '@ng-shared';
import { switchMap, map, catchError, of, withLatestFrom, tap, filter } from 'rxjs';
import { fromApi, fromCounterPage, fromTopBar } from './counter.events';
import { evst, view } from '@evst/ngrx-store';

export interface CounterState {
  count: number;
}

const initialState: CounterState = { count: 0 };

export const counterEvst = evst('Counter', initialState)
  .view((builtInViews) => {
    return {
      error: view(builtInViews.count, (count) =>
        count < -9 || count > 9 ? 'Count must be in range -9 to 9.' : '',
      ),
    };
  })
  .state((on) => {
    return {
      increment: on(fromCounterPage.incrementClicked, (state): CounterState => {
        return { ...state, count: state.count + 1 };
      }),
      decrement: on(fromCounterPage.decrementClicked, (state): CounterState => {
        return { ...state, count: state.count - 1 };
      }),
      reset: on(fromApi.restoreFailure, (): CounterState => initialState),
      setCount: on(fromApi.restoreSuccess, (state, { count }): CounterState => ({
        ...state,
        count,
      })),
    };
  })
  .task((on, views) => {
    return {
      restoreCounter: on(
        fromCounterPage.restoreClicked,
        fromCounterPage.entered,
        fromTopBar.restoreClicked,
        (pipe, api = inject(ApiService)) => {
          return pipe(
            switchMap(() => api.restoreCounter()),
            map((count) => fromApi.restoreSuccess({ count })),
            catchError(() => of(fromApi.restoreFailure())),
          );
        },
      ),
      backupCounter: on(
        fromCounterPage.backupClicked,
        (pipe, api = inject(ApiService)) => {
          return pipe(
            withLatestFrom(views.count.observable(), views.error.observable()),
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

export const counterViews = counterEvst.views;
