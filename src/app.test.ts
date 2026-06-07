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

  it('double-clicking a title shows a prefilled edit input', () => {
    const store = createStore();
    store.add('buy milk');

    mountApp(root, store);

    const label = root.querySelector<HTMLSpanElement>('ul.todo-list li .title');
    label?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

    const edit = root.querySelector<HTMLInputElement>('ul.todo-list li input.edit');
    expect(edit).not.toBeNull();
    expect(edit?.value).toBe('buy milk');
    expect(root.querySelector('ul.todo-list li .title')).toBeNull();
  });

  it('pressing Enter commits the new title to store and DOM', () => {
    const store = createStore();
    const todo = store.add('buy milk');

    mountApp(root, store);

    const label = root.querySelector<HTMLSpanElement>('ul.todo-list li .title');
    label?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

    const edit = root.querySelector<HTMLInputElement>('ul.todo-list li input.edit');
    if (edit) {
      edit.value = 'buy oat milk';
      edit.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    }

    expect(store.getTodos()[0].title).toBe('buy oat milk');
    const title = root.querySelector('ul.todo-list li .title');
    expect(title?.textContent).toBe('buy oat milk');
    expect(root.querySelector('ul.todo-list li input.edit')).toBeNull();
    expect(todo.id).toBe(store.getTodos()[0].id);
  });

  it('pressing Escape restores the original title without touching the store', () => {
    const store = createStore();
    store.add('buy milk');

    mountApp(root, store);

    const label = root.querySelector<HTMLSpanElement>('ul.todo-list li .title');
    label?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

    const edit = root.querySelector<HTMLInputElement>('ul.todo-list li input.edit');
    if (edit) {
      edit.value = 'something else';
      edit.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    }

    expect(store.getTodos()[0].title).toBe('buy milk');
    const title = root.querySelector('ul.todo-list li .title');
    expect(title?.textContent).toBe('buy milk');
    expect(root.querySelector('ul.todo-list li input.edit')).toBeNull();
  });

  it('committing a whitespace-only title leaves the todo unchanged', () => {
    const store = createStore();
    store.add('buy milk');

    mountApp(root, store);

    const label = root.querySelector<HTMLSpanElement>('ul.todo-list li .title');
    label?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

    const edit = root.querySelector<HTMLInputElement>('ul.todo-list li input.edit');
    if (edit) {
      edit.value = '   ';
      edit.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    }

    expect(store.getTodos()[0].title).toBe('buy milk');
    const title = root.querySelector('ul.todo-list li .title');
    expect(title?.textContent).toBe('buy milk');
    expect(root.querySelector('ul.todo-list li input.edit')).toBeNull();
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

  it('shows "0 items left" for an empty store', () => {
    const store = createStore();
    mountApp(root, store);

    const count = root.querySelector('.todo-count');
    expect(count?.textContent).toBe('0 items left');
  });

  it('shows "1 item left" (singular) for a single active todo', () => {
    const store = createStore();
    store.add('buy milk');
    mountApp(root, store);

    const count = root.querySelector('.todo-count');
    expect(count?.textContent).toBe('1 item left');
  });

  it('counts only non-completed todos for several remaining', () => {
    const store = createStore();
    store.add('a');
    store.add('b');
    const done = store.add('c');
    store.toggle(done.id);
    mountApp(root, store);

    const count = root.querySelector('.todo-count');
    expect(count?.textContent).toBe('2 items left');
  });

  it('updates the counter after a toggle', () => {
    const store = createStore();
    store.add('a');
    store.add('b');
    mountApp(root, store);

    expect(root.querySelector('.todo-count')?.textContent).toBe('2 items left');

    const toggle = root.querySelector<HTMLInputElement>('ul.todo-list li input.toggle');
    if (toggle) {
      toggle.checked = true;
      toggle.dispatchEvent(new Event('change'));
    }

    expect(root.querySelector('.todo-count')?.textContent).toBe('1 item left');
  });

  it('does not render the clear-completed button when nothing is completed', () => {
    const store = createStore();
    store.add('a');
    store.add('b');
    mountApp(root, store);

    expect(root.querySelector('.clear-completed')).toBeNull();
  });

  it('clear-completed removes only completed todos', () => {
    const store = createStore();
    const a = store.add('keep');
    const b = store.add('done');
    store.toggle(b.id);
    mountApp(root, store);

    const clear = root.querySelector<HTMLButtonElement>('.clear-completed');
    expect(clear).not.toBeNull();
    clear?.click();

    const items = root.querySelectorAll<HTMLLIElement>('ul.todo-list li');
    expect(items).toHaveLength(1);
    expect(items[0].dataset.id).toBe(a.id);
    expect(store.getTodos().map((t) => t.id)).toEqual([a.id]);
    expect(root.querySelector('.clear-completed')).toBeNull();
  });

  it('renders all todos by default with the "all" filter selected', () => {
    const store = createStore();
    store.add('buy milk');
    const done = store.add('walk dog');
    store.toggle(done.id);

    mountApp(root, store);

    expect(root.querySelectorAll('ul.todo-list li')).toHaveLength(2);
    const all = root.querySelector('nav.filters button[data-filter="all"]');
    expect(all?.classList.contains('selected')).toBe(true);
  });

  it('the active filter hides completed todos', () => {
    const store = createStore();
    const a = store.add('buy milk');
    const done = store.add('walk dog');
    store.toggle(done.id);

    mountApp(root, store);

    const active = root.querySelector<HTMLButtonElement>(
      'nav.filters button[data-filter="active"]',
    );
    active?.click();

    const items = root.querySelectorAll<HTMLLIElement>('ul.todo-list li');
    expect(items).toHaveLength(1);
    expect(items[0].dataset.id).toBe(a.id);
  });

  it('the completed filter shows only completed todos', () => {
    const store = createStore();
    store.add('buy milk');
    const done = store.add('walk dog');
    store.toggle(done.id);

    mountApp(root, store);

    const completed = root.querySelector<HTMLButtonElement>(
      'nav.filters button[data-filter="completed"]',
    );
    completed?.click();

    const items = root.querySelectorAll<HTMLLIElement>('ul.todo-list li');
    expect(items).toHaveLength(1);
    expect(items[0].dataset.id).toBe(done.id);
  });

  it('the selected class follows the clicked button', () => {
    const store = createStore();
    store.add('buy milk');

    mountApp(root, store);

    const all = root.querySelector<HTMLButtonElement>(
      'nav.filters button[data-filter="all"]',
    );
    const active = root.querySelector<HTMLButtonElement>(
      'nav.filters button[data-filter="active"]',
    );
    const completed = root.querySelector<HTMLButtonElement>(
      'nav.filters button[data-filter="completed"]',
    );

    expect(all?.classList.contains('selected')).toBe(true);

    active?.click();
    expect(active?.classList.contains('selected')).toBe(true);
    expect(all?.classList.contains('selected')).toBe(false);
    expect(completed?.classList.contains('selected')).toBe(false);

    completed?.click();
    expect(completed?.classList.contains('selected')).toBe(true);
    expect(active?.classList.contains('selected')).toBe(false);
  });
});
