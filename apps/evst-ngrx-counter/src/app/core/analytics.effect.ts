import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { props } from '@ngrx/store';
import { events, task } from '@evst/ngrx-store';
import { tap } from 'rxjs';
import { AnalyticsService } from '@ng-shared';

export const analyticsAction = events('Analytics', {
  track: props<{ eventName: string; properties?: Record<string, unknown> }>(),
});

export const analyticsTasks = task((on) => {
  return {
    track: on(
      (actions$ = inject(Actions), analyticsService = inject(AnalyticsService)) => {
        return actions$.pipe(
          ofType(analyticsAction.track),
          tap(({ eventName, properties }) => {
            analyticsService.track(eventName, properties);
          }),
        );
      },
      { dispatch: false },
    ),
  };
});
