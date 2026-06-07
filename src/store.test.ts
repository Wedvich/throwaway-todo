import { describe, expect, it, vi } from 'vitest';
import { TodoStore } from './store.js';

describe('TodoStore.clearCompleted', () => {
  it('removes all completed todos', () => {
    const store = new TodoStore();
    const a = store.add('a');
    store.add('b');
    const c = store.add('c');
    store.toggle(a.id);
    store.toggle(c.id);

    store.clearCompleted();

    const titles = store.getTodos().map((t) => t.title);
    expect(titles).toEqual(['b']);
  });

  it('notifies listeners exactly once when something is cleared', () => {
    const store = new TodoStore();
    const a = store.add('a');
    store.toggle(a.id);

    const listener = vi.fn();
    store.subscribe(listener);
    store.clearCompleted();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('is a no-op with no notification when nothing is completed', () => {
    const store = new TodoStore();
    store.add('a');
    store.add('b');

    const listener = vi.fn();
    store.subscribe(listener);
    store.clearCompleted();

    expect(listener).not.toHaveBeenCalled();
    expect(store.getTodos().map((t) => t.title)).toEqual(['a', 'b']);
  });
});
