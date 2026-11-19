import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideStore, Store } from '@ngrx/store';
import { AnalyticsService } from '@ng-shared';
import { firstValueFrom, take } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fromCounterPage, fromTopBar } from '../counter/store/counter.events';
import { analyticsTasks } from './analytics.tasks';

describe('analyticsTasks', () => {
  afterEach(() => TestBed.resetTestingModule());

  it.each([
    fromCounterPage.incrementClicked,
    fromCounterPage.decrementClicked,
    fromTopBar.restoreClicked,
  ])('tracks %s events', async (event) => {
    const analytics = { track: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideEffects(),
        { provide: AnalyticsService, useValue: analytics },
      ],
    });
    const action = event();
    const tracked = TestBed.runInInjectionContext(() =>
      firstValueFrom(analyticsTasks.effects.track().pipe(take(1))),
    );

    TestBed.inject(Store).dispatch(action);
    await tracked;

    expect(analytics.track).toHaveBeenCalledWith(action.type, action);
  });
});
