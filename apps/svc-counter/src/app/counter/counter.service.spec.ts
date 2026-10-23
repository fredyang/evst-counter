import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsService, ApiService } from '@ng-shared';
import { CounterService } from './counter.service';

describe('CounterService', () => {
  const api = { restoreCounter: vi.fn(() => of(0)), saveCounter: vi.fn(() => of(null)) };
  const analytics = { track: vi.fn() };

  beforeEach(() => {
    vi.resetAllMocks();
    api.restoreCounter.mockReturnValue(of(0));
    api.saveCounter.mockReturnValue(of(null));
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: api },
        { provide: AnalyticsService, useValue: analytics },
      ],
    });
    vi.spyOn(window, 'alert').mockImplementation(() => undefined);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });

  it('restores once when the shared service is created', () => {
    api.restoreCounter.mockReturnValue(of(4));
    const counter = TestBed.inject(CounterService);
    expect(counter.count()).toBe(4);
    expect(TestBed.inject(CounterService)).toBe(counter);
    expect(api.restoreCounter).toHaveBeenCalledTimes(1);
    expect(analytics.track).not.toHaveBeenCalled();
  });

  it('updates the count, derives the range warning, and tracks interactions', () => {
    const counter = TestBed.inject(CounterService);
    for (let i = 0; i < 10; i++) counter.increment();
    expect(counter.count()).toBe(10);
    expect(counter.error()).toBe('Count must be in range -9 to 9.');
    counter.decrement();
    expect(counter.error()).toBe('');
    for (let i = 0; i < 19; i++) counter.decrement();
    expect(counter.count()).toBe(-10);
    expect(counter.error()).toBe('Count must be in range -9 to 9.');
    expect(analytics.track).toHaveBeenCalledWith('increment');
    expect(analytics.track).toHaveBeenCalledWith('decrement');
  });

  it('backs up the current value and reports success', () => {
    const counter = TestBed.inject(CounterService);
    counter.increment();
    counter.backup();
    expect(api.saveCounter).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith('Counter backup completed successfully.');
    expect(analytics.track).toHaveBeenCalledWith('backup');
  });

  it('reports backup failures and allows a later backup', () => {
    const counter = TestBed.inject(CounterService);
    api.saveCounter.mockReturnValueOnce(throwError(() => new Error('Storage unavailable')));
    counter.backup();
    expect(window.alert).toHaveBeenCalledWith('Backing up the counter failed.');
    counter.backup();
    expect(window.alert).toHaveBeenLastCalledWith('Counter backup completed successfully.');
  });

  it('resets on restore failure and allows another restore', () => {
    const counter = TestBed.inject(CounterService);
    counter.increment();
    api.restoreCounter.mockReturnValueOnce(throwError(() => new Error('Restore failed')));
    counter.restore();
    expect(counter.count()).toBe(0);
    api.restoreCounter.mockReturnValueOnce(of(6));
    counter.restore();
    expect(counter.count()).toBe(6);
    expect(analytics.track).toHaveBeenCalledWith('restore');
  });

  it('ignores an older restore after a newer request and cleans up on destruction', () => {
    const counter = TestBed.inject(CounterService);
    const older = new Subject<number>();
    const newer = new Subject<number>();
    api.restoreCounter.mockReturnValueOnce(older).mockReturnValueOnce(newer);
    counter.restore();
    counter.restore();
    older.next(7);
    expect(counter.count()).toBe(0);
    newer.next(3);
    expect(counter.count()).toBe(3);
    TestBed.resetTestingModule();
    newer.next(8);
    expect(counter.count()).toBe(3);
  });
});
