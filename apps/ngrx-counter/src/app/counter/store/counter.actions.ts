import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const counterActions = createActionGroup({
  source: 'Counter',
  events: {
    increment: emptyProps(),
    decrement: emptyProps(),
    restore: emptyProps(),
    resetToInitial: emptyProps(),
    backup: emptyProps(),
    setCount: props<{ count: number }>(),
  },
});
