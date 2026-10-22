import { TestBed } from '@angular/core/testing';
import { provideState, provideStore } from '@ngrx/store';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { provideEffects } from '@ngrx/effects';
import * as counterEffects from './counter/store/counter.effects';
import { App } from './app/app';
import { counterFeature } from './counter/store/counter.feature';

describe('Counter app', () => {
  afterEach(() => vi.restoreAllMocks());

  it('updates the displayed store count and resets it from either reset button', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideStore(), provideState(counterFeature), provideEffects(counterEffects)],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const count = () => element.querySelector('output')?.textContent?.trim();
    const click = async (selector: string) => {
      element.querySelector<HTMLButtonElement>(selector)!.click();
      await fixture.whenStable();
    };

    expect(count()).toBe('0');
    await click('[aria-label="Reset counter"]');
    expect(confirm).not.toHaveBeenCalled();
    await click('[aria-label="Decrement counter"]');
    expect(count()).toBe('-1');
    await click('[aria-label="Increment counter"]');
    await click('[aria-label="Increment counter"]');
    expect(count()).toBe('1');
    await click('[aria-label="Reset counter"]');
    expect(confirm).toHaveBeenCalledWith('if you reset, the current number will be gone!');
    expect(count()).toBe('1');
    confirm.mockReturnValue(true);
    await click('[aria-label="Reset counter"]');
    expect(count()).toBe('0');
    await click('[aria-label="Increment counter"]');
    await click('.reset-button');
    expect(count()).toBe('0');
  });
});
