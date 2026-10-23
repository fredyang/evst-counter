import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { ApiService } from '@ng-shared';
import { analyticsAction, analyticsEffect } from '../../core/analytics.effect';
import { counterActions } from './counter.actions';
import { backupCounter, restoreCounter } from './counter.effects';
import { counterFeature } from './counter.feature';

describe('restoreCounter', () => {
  it('maps a restored value to setCount', async () => {
    const api = {
      restoreCounter: vi.fn().mockReturnValue(of(7)),
    } as unknown as ApiService;

    const action = await firstValueFrom(
      restoreCounter(new Actions(of(counterActions.restore())), api),
    );

    expect(action).toEqual(counterActions.setCount({ count: 7 }));
  });

  it('falls back to the reset action when restore fails', async () => {
    const api = {
      restoreCounter: vi.fn().mockReturnValue(throwError(() => new Error('Unavailable'))),
    } as unknown as ApiService;

    const action = await firstValueFrom(
      restoreCounter(new Actions(of(counterActions.restore())), api),
    );

    expect(action).toEqual(counterActions.reset());
  });
});

describe('backupCounter', () => {
  it('saves the current count when there are no validation errors', async () => {
    const api = {
      saveCounter: vi.fn().mockReturnValue(of(null)),
    } as unknown as ApiService;
    const store = {
      select: vi.fn((selector) => {
        if (selector === counterFeature.selectCount) {
          return of(7);
        }
        if (selector === counterFeature.selectError) {
          return of('');
        }
        return of(undefined);
      }),
    } as unknown as Store;
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await new Promise<void>((resolve, reject) => {
      backupCounter(new Actions(of(counterActions.backup())), store, api).subscribe({
        complete: resolve,
        error: reject,
      });
    });

    expect(api.saveCounter).toHaveBeenCalledWith(7);
    expect(alertSpy).toHaveBeenCalledWith('Counter backup completed successfully.');
  });

  it('does not save when validation fails', async () => {
    const api = {
      saveCounter: vi.fn().mockReturnValue(of(null)),
    } as unknown as ApiService;
    const store = {
      select: vi.fn((selector) => {
        if (selector === counterFeature.selectCount) {
          return of(10);
        }
        if (selector === counterFeature.selectError) {
          return of('Count must be in range -9 to 9.');
        }
        return of(undefined);
      }),
    } as unknown as Store;
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await new Promise<void>((resolve, reject) => {
      backupCounter(new Actions(of(counterActions.backup())), store, api).subscribe({
        complete: resolve,
        error: reject,
      });
    });

    expect(api.saveCounter).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      'Cannot back up the counter: Count must be in range -9 to 9.',
    );
  });
});

describe('analyticsEffect', () => {
  it('tracks analytics events with the provided payload', async () => {
    const analyticsService = {
      track: vi.fn(),
    };

    await new Promise<void>((resolve, reject) => {
      analyticsEffect(
        new Actions(
          of(
            analyticsAction.track({
              eventName: 'increment',
              properties: { from: 'counter' },
            }),
          ),
        ),
        analyticsService as never,
      ).subscribe({
        complete: resolve,
        error: reject,
      });
    });

    expect(analyticsService.track).toHaveBeenCalledWith('increment', { from: 'counter' });
  });
});
