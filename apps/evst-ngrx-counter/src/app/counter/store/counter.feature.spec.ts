import { describe, expect, it } from 'vitest';
import { counterEvst } from './counter.feature';

describe('counter error selector', () => {
  it.each([-10, 10])('returns a range error for %i', (count) => {
    expect(counterEvst.selectError({ counter: { count } })).toBe('Count must be in range -9 to 9.');
  });

  it.each([-9, 0, 9])('returns no error for %i', (count) => {
    expect(counterEvst.selectError({ counter: { count } })).toBe('');
  });
});
