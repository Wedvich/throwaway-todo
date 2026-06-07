import { describe, expect, it } from 'vitest';
import { mountApp } from './app.js';
import { createStore } from './store.js';

function submitForm(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('form.todo-form');
  if (!form) {
    throw new Error('todo-form not found');
  }
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

describe('add-todo form', () => {
  it('appends a todo with the typed title and clears the input', () => {
    const root = document.createElement('div');
    const store = createStore();
    mountApp(root, store);

    const input = root.querySelector<HTMLInputElement>('input[name="title"]');
    expect(input).not.toBeNull();
    input!.value = 'Buy milk';

    submitForm(root);

    expect(store.all().map((todo) => todo.title)).toEqual(['Buy milk']);

    const items = Array.from(root.querySelectorAll('li')).map((li) => li.textContent);
    expect(items).toEqual(['Buy milk']);

    expect(input!.value).toBe('');
  });

  it('ignores whitespace-only submissions, leaving the list and store unchanged', () => {
    const root = document.createElement('div');
    const store = createStore();
    mountApp(root, store);

    const input = root.querySelector<HTMLInputElement>('input[name="title"]');
    expect(input).not.toBeNull();
    input!.value = '   ';

    submitForm(root);

    expect(store.all()).toEqual([]);
    expect(root.querySelectorAll('li').length).toBe(0);
  });
});
