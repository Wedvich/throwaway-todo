import { beforeEach, describe, expect, it } from 'vitest';
import { mountApp } from './app.js';
import { createStore } from './store.js';

describe('mountApp', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
  });

  it('renders an empty todo-list for an empty store', () => {
    const store = createStore();
    mountApp(root, store);

    const list = root.querySelector('ul.todo-list');
    expect(list).not.toBeNull();
    expect(list?.querySelectorAll('li')).toHaveLength(0);
  });

  it('renders existing todos with their titles and data-id attributes', () => {
    const store = createStore();
    const a = store.add('buy milk');
    const b = store.add('walk dog');

    mountApp(root, store);

    const items = root.querySelectorAll<HTMLLIElement>('ul.todo-list li');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toBe('buy milk');
    expect(items[0].dataset.id).toBe(a.id);
    expect(items[1].textContent).toBe('walk dog');
    expect(items[1].dataset.id).toBe(b.id);
  });

  it('re-renders after store.add', () => {
    const store = createStore();
    mountApp(root, store);

    expect(root.querySelectorAll('ul.todo-list li')).toHaveLength(0);

    store.add('new task');

    const items = root.querySelectorAll<HTMLLIElement>('ul.todo-list li');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toBe('new task');
  });

  it("gives a completed todo's <li> the completed class", () => {
    const store = createStore();
    const todo = store.add('done thing');
    store.toggle(todo.id);

    mountApp(root, store);

    const item = root.querySelector<HTMLLIElement>('ul.todo-list li');
    expect(item).not.toBeNull();
    expect(item?.classList.contains('completed')).toBe(true);
  });
});
