import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const counterActions = createActionGroup({
  source: 'Counter',
  events: {
    increment: emptyProps(),
    decrement: emptyProps(),
    restore: emptyProps(),
    reset: emptyProps(),
    backup: emptyProps(),
    setCount: props<{ count: number }>(),
  },
});
