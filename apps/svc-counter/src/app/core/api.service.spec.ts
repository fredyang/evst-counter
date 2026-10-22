import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from './api.service';

describe('ApiService', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('saves and restores only on subscription', async () => {
    const api = TestBed.inject(ApiService);
    localStorage.setItem('counter', '2');
    const backup = api.saveCounter(5);
    expect(localStorage.getItem('counter')).toBe('2');
    await firstValueFrom(backup);
    expect(localStorage.getItem('counter')).toBe('5');
    const restore = api.restoreCounter();
    localStorage.setItem('counter', '7');
    expect(await firstValueFrom(restore)).toBe(7);
  });

  it('reports synchronous storage failures through the observable', async () => {
    const api = TestBed.inject(ApiService);
    const failure = new Error('Storage unavailable');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw failure;
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw failure;
    });
    await expect(firstValueFrom(api.saveCounter(3))).rejects.toBe(failure);
    await expect(firstValueFrom(api.restoreCounter())).rejects.toBe(failure);
  });
});
