import { beforeEach, describe, expect, it } from 'vitest';
import { mountApp } from './app.js';
import { TodoStore } from './store.js';

function setup() {
  const root = document.createElement('div');
  document.body.append(root);
  const store = new TodoStore();
  mountApp(root, store);
  return { root, store };
}

function countText(root: HTMLElement): string | null {
  return root.querySelector('.todo-count')?.textContent ?? null;
}

describe('mountApp counter', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('shows "0 items left" when there are no todos', () => {
    const { root } = setup();
    expect(countText(root)).toBe('0 items left');
  });

  it('shows "1 item left" (singular) with one remaining todo', () => {
    const { root, store } = setup();
    store.add('a');
    expect(countText(root)).toBe('1 item left');
  });

  it('shows "N items left" with several remaining todos', () => {
    const { root, store } = setup();
    store.add('a');
    store.add('b');
    store.add('c');
    expect(countText(root)).toBe('3 items left');
  });

  it('updates the counter after a todo is toggled', () => {
    const { root, store } = setup();
    const a = store.add('a');
    store.add('b');
    expect(countText(root)).toBe('2 items left');

    store.toggle(a.id);
    expect(countText(root)).toBe('1 item left');
  });
});

describe('mountApp clear-completed', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('is absent when nothing is completed', () => {
    const { root, store } = setup();
    store.add('a');
    store.add('b');
    expect(root.querySelector('.clear-completed')).toBeNull();
  });

  it('removes only completed todos when clicked', () => {
    const { root, store } = setup();
    const a = store.add('a');
    store.add('b');
    const c = store.add('c');
    store.toggle(a.id);
    store.toggle(c.id);

    const button = root.querySelector<HTMLButtonElement>('.clear-completed');
    expect(button).not.toBeNull();
    button!.click();

    expect(store.getTodos().map((t) => t.title)).toEqual(['b']);
    expect(countText(root)).toBe('1 item left');
    expect(root.querySelector('.clear-completed')).toBeNull();
  });
});
