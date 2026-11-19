import { fromApi, fromCounterPage } from './counter.actions';
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
  });
