/* eslint-disable evst/event-publisher-ownership, evst/no-sequential-event-publishes -- Unit tests dispatch events directly to exercise generated tasks. */
import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore, Store } from '@ngrx/store';
import { ApiService } from '@ng-shared';
import { firstValueFrom, of, take, throwError, type Observable } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fromApi, fromCounterPage, fromTopBar } from './counter.events';
import { counterEvst } from './counter.evst';

describe('counterEvst state', () => {
  it('increments and decrements the count', () => {
    const incremented = counterEvst.reducer(
      undefined,
      fromCounterPage.incrementClicked(),
    );
    const decremented = counterEvst.reducer(
      incremented,
      fromCounterPage.decrementClicked(),
    );

    expect(incremented.count).toBe(1);
    expect(decremented.count).toBe(0);
  });

  it('sets the restored count and resets after a restore failure', () => {
    const restored = counterEvst.reducer(
      undefined,
      fromApi.restoreSuccess({ count: 7 }),
    );
    const reset = counterEvst.reducer(restored, fromApi.restoreFailure());

    expect(restored.count).toBe(7);
    expect(reset.count).toBe(0);
  });
});

describe('counterEvst error view', () => {
  it.each([-10, 10])('returns a range error for %i', (count) => {
    expect(counterEvst.views.error({ Counter: { count } })).toBe(
      'Count must be in range -9 to 9.',
    );
  });

  it.each([-9, 0, 9])('returns no error for %i', (count) => {
    expect(counterEvst.views.error({ Counter: { count } })).toBe('');
  });
});

describe('counterEvst tasks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it.each([
    fromCounterPage.restoreClicked,
    fromCounterPage.entered,
    fromTopBar.restoreClicked,
  ])('restores the counter for %s', async (restoreEvent) => {
    const api = { restoreCounter: vi.fn().mockReturnValue(of(7)) };
    configureTasks(api);

    const result = runTask(counterEvst.effects.restoreCounter);
    TestBed.inject(Store).dispatch(restoreEvent());

    await expect(result).resolves.toEqual(fromApi.restoreSuccess({ count: 7 }));
  });

  it('maps a restore error to restoreFailure', async () => {
    const api = {
      restoreCounter: vi.fn().mockReturnValue(throwError(() => new Error('Unavailable'))),
    };
    configureTasks(api);

    const result = runTask(counterEvst.effects.restoreCounter);
    TestBed.inject(Store).dispatch(fromCounterPage.restoreClicked());

    await expect(result).resolves.toEqual(fromApi.restoreFailure());
  });

  it('backs up the current count when it is valid', async () => {
    const api = { saveCounter: vi.fn().mockReturnValue(of(null)) };
    configureTasks(api);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const store = TestBed.inject(Store);
    store.dispatch(fromApi.restoreSuccess({ count: 7 }));

    const result = runTask(counterEvst.effects.backupCounter);
    store.dispatch(fromCounterPage.backupClicked());
    await result;

    expect(api.saveCounter).toHaveBeenCalledWith(7);
    expect(alertSpy).toHaveBeenCalledWith('Counter backup completed successfully.');
  });

  it('does not back up an invalid count', async () => {
    const api = { saveCounter: vi.fn().mockReturnValue(of(null)) };
    configureTasks(api);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const store = TestBed.inject(Store);
    store.dispatch(fromApi.restoreSuccess({ count: 10 }));

    const subscription = TestBed.runInInjectionContext(() =>
      counterEvst.effects.backupCounter().subscribe(),
    );
    store.dispatch(fromCounterPage.backupClicked());

    expect(api.saveCounter).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      'Cannot back up the counter: Count must be in range -9 to 9.',
    );
    subscription.unsubscribe();
  });
});

function configureTasks(api: Partial<ApiService>): void {
  TestBed.configureTestingModule({
    providers: [
      provideStore(),
      provideState(counterEvst.name, counterEvst.reducer),
      provideEffects(),
      { provide: ApiService, useValue: api },
    ],
  });
}

function runTask(task: () => Observable<unknown>): Promise<unknown> {
  return TestBed.runInInjectionContext(() => firstValueFrom(task().pipe(take(1))));
}
