import '@angular/compiler';
import { Actions } from '@ngrx/effects';
import { firstValueFrom, of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { counterActions } from './counter.actions';
import { resetCounterPristine } from './counter.effects';
import { counterFeature } from './counter.feature';

describe('resetCounter', () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each(['7', '-12', '0', null, '', 'invalid', 'Infinity'])(
    'resets using the saved value %s or the initial state',
    async (saved) => {
      vi.stubGlobal('localStorage', { getItem: vi.fn().mockReturnValue(saved) });
      const action = await firstValueFrom(
        resetCounterPristine(new Actions(of(counterActions.resetToPristine()))),
      );
      const state = counterFeature.reducer({ count: 42, error: 'Old error' }, action);
      expect(state).toEqual({
        count: saved !== null && saved !== '' && Number.isFinite(Number(saved)) ? Number(saved) : 0,
        error: '',
      });
    },
  );

  it('falls back to initial state when storage throws', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('Unavailable');
      },
    });
    const action = await firstValueFrom(
      resetCounterPristine(new Actions(of(counterActions.resetToPristine()))),
    );
    expect(action).toEqual(counterActions.resetToInitial());
  });
});
