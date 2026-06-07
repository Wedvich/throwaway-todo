import { describe, expect, it, vi } from 'vitest';
import { createStore } from './store.js';

describe('createStore', () => {
  it('add returns the created todo and it appears in getTodos with the trimmed title', () => {
    const store = createStore();
    const todo = store.add('  buy milk  ');

    expect(todo.title).toBe('buy milk');
    expect(todo.completed).toBe(false);
    expect(typeof todo.id).toBe('string');

    const todos = store.getTodos();
    expect(todos).toHaveLength(1);
    expect(todos[0]).toEqual(todo);
  });

  it('toggle flips completed in both directions', () => {
    const store = createStore();
    const todo = store.add('task');

    store.toggle(todo.id);
    expect(store.getTodos()[0].completed).toBe(true);

    store.toggle(todo.id);
    expect(store.getTodos()[0].completed).toBe(false);
  });

  it('remove deletes only the matching todo', () => {
    const store = createStore();
    const a = store.add('a');
    const b = store.add('b');
    const c = store.add('c');

    store.remove(b.id);

    const ids = store.getTodos().map((t) => t.id);
    expect(ids).toEqual([a.id, c.id]);
  });

  it('subscribe fires on each mutation and stops firing after unsubscribe', () => {
    const store = createStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    const todo = store.add('a');
    expect(listener).toHaveBeenCalledTimes(1);

    store.toggle(todo.id);
    expect(listener).toHaveBeenCalledTimes(2);

    store.remove(todo.id);
    expect(listener).toHaveBeenCalledTimes(3);

    unsubscribe();
    store.add('b');
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('unknown-id toggle/remove change nothing and do not notify', () => {
    const store = createStore();
    const todo = store.add('a');
    const listener = vi.fn();
    store.subscribe(listener);

    const before = store.getTodos();

    store.toggle('nope');
    store.remove('nope');

    expect(store.getTodos()).toEqual(before);
    expect(store.getTodos()[0]).toEqual(todo);
    expect(listener).not.toHaveBeenCalled();
  });
});
