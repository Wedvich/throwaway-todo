import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TodoStore } from './store.js';

describe('TodoStore.rename', () => {
  let store: TodoStore;
  let id: string;

  beforeEach(() => {
    store = new TodoStore();
    id = store.add('original').id;
  });

  it('updates the title', () => {
    store.rename(id, 'renamed');
    expect(store.getAll()[0].title).toBe('renamed');
  });

  it('trims the title before storing it', () => {
    store.rename(id, '  spaced out  ');
    expect(store.getAll()[0].title).toBe('spaced out');
  });

  it('notifies listeners on a successful rename', () => {
    const listener = vi.fn();
    store.subscribe(listener);
    store.rename(id, 'renamed');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('leaves the todo unchanged and notifies nobody for a whitespace-only title', () => {
    const listener = vi.fn();
    store.subscribe(listener);
    store.rename(id, '   ');
    expect(store.getAll()[0].title).toBe('original');
    expect(listener).not.toHaveBeenCalled();
  });

  it('leaves the todos unchanged and notifies nobody for an unknown id', () => {
    const listener = vi.fn();
    store.subscribe(listener);
    store.rename('does-not-exist', 'renamed');
    expect(store.getAll()[0].title).toBe('original');
    expect(listener).not.toHaveBeenCalled();
  });
});
