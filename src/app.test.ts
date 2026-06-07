import { beforeEach, describe, expect, it } from 'vitest';
import { createTodoApp } from './app.js';
import { Store } from './store.js';

function lis(root: HTMLElement): HTMLLIElement[] {
  return Array.from(root.querySelectorAll<HTMLLIElement>('li.todo'));
}

describe('per-todo controls', () => {
  let root: HTMLDivElement;
  let store: Store;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
    store = new Store();
    createTodoApp(root, store);
  });

  it('reflects the completed flag in the checkbox and class', () => {
    store.add('a');
    store.add('b');
    store.toggle(lis(root)[1].dataset.id!);

    const items = lis(root);
    expect(items[0].classList.contains('completed')).toBe(false);
    expect(items[0].querySelector<HTMLInputElement>('input.toggle')!.checked).toBe(false);
    expect(items[1].classList.contains('completed')).toBe(true);
    expect(items[1].querySelector<HTMLInputElement>('input.toggle')!.checked).toBe(true);
  });

  it('toggling a todo checkbox flips its completed class and checkbox state', () => {
    store.add('a');
    store.add('b');

    const before = lis(root);
    const firstToggle = before[0].querySelector<HTMLInputElement>('input.toggle')!;
    expect(firstToggle.checked).toBe(false);
    expect(before[0].classList.contains('completed')).toBe(false);

    firstToggle.click();

    const after = lis(root);
    expect(after[0].classList.contains('completed')).toBe(true);
    expect(after[0].querySelector<HTMLInputElement>('input.toggle')!.checked).toBe(true);
    // the other todo is left untouched
    expect(after[1].classList.contains('completed')).toBe(false);
    expect(after[1].querySelector<HTMLInputElement>('input.toggle')!.checked).toBe(false);

    // clicking again toggles back off
    after[0].querySelector<HTMLInputElement>('input.toggle')!.click();
    const final = lis(root);
    expect(final[0].classList.contains('completed')).toBe(false);
    expect(final[0].querySelector<HTMLInputElement>('input.toggle')!.checked).toBe(false);
  });

  it('clicking destroy removes exactly that todo and leaves the others', () => {
    store.add('a');
    store.add('b');
    store.add('c');

    const items = lis(root);
    const ids = items.map((li) => li.dataset.id);
    expect(items).toHaveLength(3);

    items[1].querySelector<HTMLButtonElement>('button.destroy')!.click();

    const remaining = lis(root);
    expect(remaining).toHaveLength(2);
    expect(remaining.map((li) => li.dataset.id)).toEqual([ids[0], ids[2]]);
    expect(remaining.map((li) => li.querySelector('.title')!.textContent)).toEqual(['a', 'c']);
  });
});
