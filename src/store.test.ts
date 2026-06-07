import { describe, expect, it, vi } from 'vitest';
import { createStore } from './store.js';

describe('createStore', () => {
  it('add returns the created todo with trimmed title and it appears in getTodos', () => {
    const store = createStore();
    const todo = store.add('  walk the dog  ');

    expect(todo.title).toBe('walk the dog');
    expect(todo.completed).toBe(false);
    expect(typeof todo.id).toBe('string');

    const todos = store.getTodos();
    expect(todos).toHaveLength(1);
    expect(todos[0]).toBe(todo);
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

  it('subscribe fires on each mutation and stops after unsubscribe', () => {
    const store = createStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    const todo = store.add('task');
    expect(listener).toHaveBeenCalledTimes(1);

    store.toggle(todo.id);
    expect(listener).toHaveBeenCalledTimes(2);

    store.remove(todo.id);
    expect(listener).toHaveBeenCalledTimes(3);

    unsubscribe();
    store.add('another');
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('unknown-id toggle/remove change nothing and do not notify', () => {
    const store = createStore();
    const todo = store.add('task');
    const before = store.getTodos();

    const listener = vi.fn();
    store.subscribe(listener);

    store.toggle('missing');
    store.remove('missing');

    expect(listener).not.toHaveBeenCalled();
    expect(store.getTodos()).toBe(before);
    expect(store.getTodos()).toEqual([todo]);
  });
});
