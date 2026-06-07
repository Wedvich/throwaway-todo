import type { Todo, TodoStore } from './store.js';

type Filter = 'all' | 'active' | 'completed';

export function mountApp(root: HTMLElement, store: TodoStore): void {
  let filter: Filter = 'all';

  const nav = document.createElement('nav');
  nav.className = 'filters';

  const filters: Filter[] = ['all', 'active', 'completed'];
  const buttons = new Map<Filter, HTMLButtonElement>();
  for (const value of filters) {
    const button = document.createElement('button');
    button.dataset.filter = value;
    button.textContent = value;
    button.addEventListener('click', () => {
      filter = value;
      render();
    });
    buttons.set(value, button);
    nav.appendChild(button);
  }
  root.appendChild(nav);

  const list = document.createElement('ul');
  list.className = 'todo-list';
  root.appendChild(list);

  function visibleTodos(): readonly Todo[] {
    const todos = store.getTodos();
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed);
    }
    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed);
    }
    return todos;
  }

  function render(): void {
    for (const [value, button] of buttons) {
      button.classList.toggle('selected', value === filter);
    }

    list.replaceChildren();
    for (const todo of visibleTodos()) {
      const item = document.createElement('li');
      item.dataset.id = todo.id;
      if (todo.completed) {
        item.classList.add('completed');
      }

      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.className = 'toggle';
      toggle.checked = todo.completed;
      toggle.addEventListener('change', () => {
        store.toggle(todo.id);
      });

      const label = document.createElement('span');
      label.className = 'title';
      label.textContent = todo.title;
      label.addEventListener('dblclick', () => {
        const edit = document.createElement('input');
        edit.type = 'text';
        edit.className = 'edit';
        edit.value = todo.title;

        function commit(): void {
          store.rename(todo.id, edit.value);
          render();
        }

        edit.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            commit();
          } else if (event.key === 'Escape') {
            render();
          }
        });

        label.replaceWith(edit);
        edit.focus();
      });

      const destroy = document.createElement('button');
      destroy.className = 'destroy';
      destroy.addEventListener('click', () => {
        store.remove(todo.id);
      });

      item.append(toggle, label, destroy);
      list.appendChild(item);
    }
  }

  render();
  store.subscribe(render);
}
