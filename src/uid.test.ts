import { describe, expect, it } from 'vitest';
import { uid } from './uid.js';

describe('uid', () => {
  it('returns a non-empty string', () => {
    expect(uid()).not.toBe('');
  });

  it('returns distinct ids across calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => uid()));
    expect(ids.size).toBe(100);
  });
});
