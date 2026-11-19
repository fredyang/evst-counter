import { emptyProps, props } from '@ngrx/store';
import { events } from '@evst/ngrx-store';

export const fromCounterPage = events('Counter Page', {
  entered: emptyProps(),
  incrementClicked: emptyProps(),
  decrementClicked: emptyProps(),
  restoreClicked: emptyProps(),
  backupClicked: emptyProps(),
});

export const fromTopBar = events('Top Bar', {
  restoreClicked: emptyProps(),
});

export const fromApi = events('API', {
  restoreSuccess: props<{ count: number }>(),
  restoreFailure: emptyProps(),
});
