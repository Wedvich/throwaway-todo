import { beforeEach, describe, expect, it } from 'vitest';
import { mountApp } from './app.js';
import { createTodoStore } from './store.js';

describe('mountApp', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
  });

  it('renders an empty <ul class="todo-list"> for an empty store', () => {
    const store = createTodoStore();
    mountApp(root, store);

    const list = root.querySelector('ul.todo-list');
    expect(list).not.toBeNull();
    expect(list?.querySelectorAll('li')).toHaveLength(0);
  });

  it('renders one <li> per todo with its title and data-id', () => {
    const store = createTodoStore([
      { id: 'a1', title: 'Buy milk', completed: false },
      { id: 'b2', title: 'Walk dog', completed: false },
    ]);
    mountApp(root, store);

    const items = root.querySelectorAll('ul.todo-list > li');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toBe('Buy milk');
    expect(items[0].getAttribute('data-id')).toBe('a1');
    expect(items[1].textContent).toBe('Walk dog');
    expect(items[1].getAttribute('data-id')).toBe('b2');
  });

  it('re-renders when a todo is added to the store', () => {
    const store = createTodoStore();
    mountApp(root, store);

    expect(root.querySelectorAll('ul.todo-list > li')).toHaveLength(0);

    store.add('Write tests');

    const items = root.querySelectorAll('ul.todo-list > li');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toBe('Write tests');
  });

  it('marks a completed todo with the "completed" class on its <li>', () => {
    const store = createTodoStore([
      { id: 'done', title: 'Done thing', completed: true },
      { id: 'open', title: 'Open thing', completed: false },
    ]);
    mountApp(root, store);

    const done = root.querySelector('li[data-id="done"]');
    const open = root.querySelector('li[data-id="open"]');
    expect(done?.classList.contains('completed')).toBe(true);
    expect(open?.classList.contains('completed')).toBe(false);
  });
});
