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
    const toggle = item?.querySelector<HTMLInputElement>('input.toggle');
    expect(toggle?.checked).toBe(true);
  });

  it("clicking a todo's checkbox toggles its completed class and checkbox state", () => {
    const store = createStore();
    store.add('buy milk');

    mountApp(root, store);

    const item = root.querySelector<HTMLLIElement>('ul.todo-list li');
    const toggle = item?.querySelector<HTMLInputElement>('input.toggle');
    expect(item?.classList.contains('completed')).toBe(false);
    expect(toggle?.checked).toBe(false);

    if (toggle) {
      toggle.checked = true;
      toggle.dispatchEvent(new Event('change'));
    }

    const afterToggle = root.querySelector<HTMLLIElement>('ul.todo-list li');
    const afterCheckbox =
      afterToggle?.querySelector<HTMLInputElement>('input.toggle');
    expect(afterToggle?.classList.contains('completed')).toBe(true);
    expect(afterCheckbox?.checked).toBe(true);

    if (afterCheckbox) {
      afterCheckbox.checked = false;
      afterCheckbox.dispatchEvent(new Event('change'));
    }

    const final = root.querySelector<HTMLLIElement>('ul.todo-list li');
    expect(final?.classList.contains('completed')).toBe(false);
    expect(
      final?.querySelector<HTMLInputElement>('input.toggle')?.checked,
    ).toBe(false);
  });

  it('clicking destroy removes exactly that <li> and leaves the others untouched', () => {
    const store = createStore();
    const a = store.add('buy milk');
    const b = store.add('walk dog');
    const c = store.add('write code');

    mountApp(root, store);

    expect(root.querySelectorAll('ul.todo-list li')).toHaveLength(3);

    const target = root.querySelector<HTMLLIElement>(
      `ul.todo-list li[data-id="${b.id}"]`,
    );
    const destroy = target?.querySelector<HTMLButtonElement>('button.destroy');
    destroy?.click();

    const items = root.querySelectorAll<HTMLLIElement>('ul.todo-list li');
    expect(items).toHaveLength(2);
    expect(items[0].dataset.id).toBe(a.id);
    expect(items[0].textContent).toBe('buy milk');
    expect(items[1].dataset.id).toBe(c.id);
    expect(items[1].textContent).toBe('write code');
    expect(
      root.querySelector(`ul.todo-list li[data-id="${b.id}"]`),
    ).toBeNull();
  });
});
