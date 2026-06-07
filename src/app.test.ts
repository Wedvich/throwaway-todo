import { beforeEach, describe, expect, it } from 'vitest';
import { mountApp } from './app.js';
import { createStore, type Todo } from './store.js';

const seedTodos: Todo[] = [
  { id: 'a', title: 'Active one', completed: false },
  { id: 'b', title: 'Active two', completed: false },
  { id: 'c', title: 'Done one', completed: true },
];

function setup() {
  const root = document.createElement('div');
  const store = createStore(seedTodos);
  mountApp(root, store);
  return root;
}

function titles(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll('.todos .todo')).map(
    (el) => el.textContent ?? '',
  );
}

function clickFilter(root: HTMLElement, filter: string): void {
  const button = root.querySelector<HTMLButtonElement>(
    `[data-filter="${filter}"]`,
  );
  if (!button) throw new Error(`missing filter button: ${filter}`);
  button.click();
}

describe('mountApp filters', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = setup();
  });

  it('renders the three filter buttons with "all" selected by default', () => {
    const buttons = root.querySelectorAll('nav.filters [data-filter]');
    expect(Array.from(buttons).map((b) => b.getAttribute('data-filter'))).toEqual([
      'all',
      'active',
      'completed',
    ]);

    const selected = root.querySelector('nav.filters .selected');
    expect(selected?.getAttribute('data-filter')).toBe('all');
  });

  it('renders all todos by default', () => {
    expect(titles(root)).toEqual(['Active one', 'Active two', 'Done one']);
  });

  it('hides completed todos under the active filter', () => {
    clickFilter(root, 'active');
    expect(titles(root)).toEqual(['Active one', 'Active two']);
  });

  it('shows only completed todos under the completed filter', () => {
    clickFilter(root, 'completed');
    expect(titles(root)).toEqual(['Done one']);
  });

  it('moves the selected class to the clicked button', () => {
    clickFilter(root, 'completed');
    let selected = root.querySelectorAll('.selected');
    expect(selected.length).toBe(1);
    expect(selected[0].getAttribute('data-filter')).toBe('completed');

    clickFilter(root, 'all');
    selected = root.querySelectorAll('.selected');
    expect(selected.length).toBe(1);
    expect(selected[0].getAttribute('data-filter')).toBe('all');
  });
});
