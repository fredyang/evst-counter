import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app/app.component';
import { AnalyticsService } from './core/analytics.service';

describe('Service counter app', () => {
  const analytics = { track: vi.fn() };

  beforeEach(() => {
    localStorage.clear();
    analytics.track.mockClear();
    vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: AnalyticsService, useValue: analytics }],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('restores on startup and shares count, backup, and both restore controls', async () => {
    localStorage.setItem('counter', '2');
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const count = () => element.querySelector('output')?.textContent?.trim();
    const click = async (selector: string) => {
      element.querySelector<HTMLButtonElement>(selector)!.click();
      await fixture.whenStable();
    };

    expect(count()).toBe('2');
    await click('[aria-label="Increment counter"]');
    expect(count()).toBe('3');
    await click('[aria-label="Backup counter"]');
    expect(localStorage.getItem('counter')).toBe('3');
    await click('[aria-label="Decrement counter"]');
    expect(count()).toBe('2');
    await click('.storage-controls [aria-label="Restore counter"]');
    expect(count()).toBe('3');
    await click('[aria-label="Increment counter"]');
    await click('header [aria-label="Restore counter"]');
    expect(count()).toBe('3');
    expect(analytics.track.mock.calls.map(([event]) => event)).toEqual([
      'increment',
      'backup',
      'decrement',
      'restore',
      'increment',
      'restore',
    ]);
  });
});
