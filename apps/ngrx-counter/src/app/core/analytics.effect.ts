import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createActionGroup, props } from '@ngrx/store';
import { tap } from 'rxjs';
import { AnalyticsService } from '@ng-shared';

export const analyticsAction = createActionGroup({
  source: 'Analytics',
  events: {
    track: props<{ eventName: string; properties?: Record<string, unknown> }>(),
  },
});

export const analyticsEffect = createEffect(
  (actions$ = inject(Actions), analyticsService = inject(AnalyticsService)) => {
    return actions$.pipe(
      ofType(analyticsAction.track),
      tap(({ eventName, properties }) => {
        analyticsService.track(eventName, properties);
      }),
    );
  },
  { functional: true, dispatch: false },
);
