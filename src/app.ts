import type { Todo, TodoStore } from './store.js';

export type Filter = 'all' | 'active' | 'completed';

const FILTERS: ReadonlyArray<{ value: Filter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

function matchesFilter(todo: Todo, filter: Filter): boolean {
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
  return true;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function mountApp(root: HTMLElement, store: TodoStore): () => void {
  // The active filter is local view state, deliberately kept out of the store.
  let filter: Filter = 'all';

  function render(): void {
    const visible = store.getTodos().filter((todo) => matchesFilter(todo, filter));

    const filterButtons = FILTERS.map((option) => {
      const selected = option.value === filter ? ' selected' : '';
      return `<button type="button" class="filter${selected}" data-filter="${option.value}">${option.label}</button>`;
    }).join('');

    const items = visible
      .map((todo) => {
        const completed = todo.completed ? ' completed' : '';
        return `<li class="todo${completed}" data-id="${todo.id}">${escapeHtml(todo.title)}</li>`;
      })
      .join('');

    root.innerHTML = `
      <h1>throwaway-todo</h1>
      <nav class="filters">${filterButtons}</nav>
      <ul class="todos">${items}</ul>
    `;
  }

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLElement>('[data-filter]');
    if (!button) return;
    filter = button.dataset.filter as Filter;
    render();
  });

  const unsubscribe = store.subscribe(render);
  render();

  return unsubscribe;
}
