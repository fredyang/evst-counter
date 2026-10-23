import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { counterActions } from './counter.actions';

export interface CounterState {
  count: number;
}

const initialState: CounterState = { count: 0 };

export const counterFeature = createFeature({
  name: 'counter',
  reducer: createReducer(
    initialState,
    on(counterActions.increment, (state): CounterState => {
      return { ...state, count: state.count + 1 };
    }),
    on(counterActions.decrement, (state): CounterState => {
      return { ...state, count: state.count - 1 };
    }),
    on(counterActions.reset, (): CounterState => initialState),
    on(counterActions.setCount, (state, { count }): CounterState => ({ ...state, count })),
  ),
  extraSelectors: (builtinSelectors) => ({
    selectError: createSelector(builtinSelectors.selectCount, (count) =>
      count < -9 || count > 9 ? 'Count must be in range -9 to 9.' : '',
    ),
  }),
});
