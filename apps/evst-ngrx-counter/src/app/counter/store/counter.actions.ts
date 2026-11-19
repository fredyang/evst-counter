import { emptyProps, props } from '@ngrx/store';
import { events } from '@evst/ngrx-store';

export const counterActions = events('Counter', {
  increment: emptyProps(),
  decrement: emptyProps(),
  restore: emptyProps(),
  reset: emptyProps(),
  backup: emptyProps(),
  setCount: props<{ count: number }>(),
});
