import { beforeEach, describe, expect, it } from 'vitest';
import { mountApp } from './app.js';
import { TodoStore } from './store.js';

function press(input: HTMLInputElement, key: string): void {
  input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

describe('inline title editing', () => {
  let root: HTMLDivElement;
  let store: TodoStore;
  let id: string;

  beforeEach(() => {
    document.body.innerHTML = '';
    root = document.createElement('div');
    document.body.append(root);
    store = new TodoStore();
    id = store.add('walk the dog').id;
    mountApp(root, store);
  });

  function title(): HTMLLabelElement {
    return root.querySelector<HTMLLabelElement>('.title')!;
  }

  function editInput(): HTMLInputElement | null {
    return root.querySelector<HTMLInputElement>('input.edit');
  }

  function dblclickTitle(): void {
    title().dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
  }

  it('shows an edit input prefilled with the current title on double-click', () => {
    expect(editInput()).toBeNull();
    dblclickTitle();
    const input = editInput();
    expect(input).not.toBeNull();
    expect(input!.value).toBe('walk the dog');
  });

  it('commits the new title to the store and DOM when Enter is pressed', () => {
    dblclickTitle();
    const input = editInput()!;
    input.value = 'walk the cat';
    press(input, 'Enter');

    expect(store.getAll()[0].title).toBe('walk the cat');
    expect(editInput()).toBeNull();
    expect(title().textContent).toBe('walk the cat');
  });

  it('restores the original title without touching the store when Escape is pressed', () => {
    dblclickTitle();
    const input = editInput()!;
    input.value = 'something else';
    press(input, 'Escape');

    expect(store.getAll()[0].title).toBe('walk the dog');
    expect(editInput()).toBeNull();
    expect(title().textContent).toBe('walk the dog');
  });

  it('leaves the todo unchanged when committing a whitespace-only title', () => {
    dblclickTitle();
    const input = editInput()!;
    input.value = '   ';
    press(input, 'Enter');

    expect(store.getAll()[0].title).toBe('walk the dog');
    expect(store.getAll()[0].id).toBe(id);
    expect(editInput()).toBeNull();
    expect(title().textContent).toBe('walk the dog');
  });
});
