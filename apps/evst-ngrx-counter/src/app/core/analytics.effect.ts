import { inject } from '@angular/core';
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
      analyticsAction.track,
      (pipe, analyticsService = inject(AnalyticsService)) => {
        return pipe(
          tap(({ eventName, properties }) => {
            analyticsService.track(eventName, properties);
          }),
        );
      },
      { dispatch: false },
    ),
  };
});
