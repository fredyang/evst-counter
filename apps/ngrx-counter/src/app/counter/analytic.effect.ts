import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createActionGroup, props } from '@ngrx/store';
import { tap } from 'rxjs';
import { AnalyticsService } from '../core/analytics.service';

export const analyticAction = createActionGroup({
  source: 'Analytic',
  events: {
    track: props<{ eventName: string; properties?: Record<string, unknown> }>(),
  },
});

export const analyticEffect = createEffect(
  (actions$ = inject(Actions), analyticsService = inject(AnalyticsService)) => {
    return actions$.pipe(
      ofType(analyticAction.track),
      tap(({ eventName, properties }) => {
        analyticsService.track(eventName, properties);
      }),
    );
  },
  { functional: true, dispatch: false },
);
