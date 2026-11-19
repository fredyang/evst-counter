import { inject } from '@angular/core';
import { task } from '@evst/ngrx-store';
import { tap } from 'rxjs';
import { AnalyticsService } from '@ng-shared';
import { fromCounterPage, fromTopBar } from '../counter/store/counter.actions';

export const analyticsTasks = task((on) => {
  return {
    track: on(
      fromCounterPage,
      fromTopBar.restoreClicked,
      (pipe, analyticsService = inject(AnalyticsService)) => {
        return pipe(
          tap((event) => {
            analyticsService.track(event.type, event);
          }),
        );
      },
      { dispatch: false },
    ),
  };
});
