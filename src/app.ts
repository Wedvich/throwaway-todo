import { TodoStore } from './store.js';

export function mountApp(root: HTMLElement, store: TodoStore): void {
  function render(): void {
    const todos = store.getTodos();
    const remaining = todos.filter((t) => !t.completed).length;
    const completed = todos.length - remaining;

    root.innerHTML = '';

    const list = document.createElement('ul');
    list.className = 'todo-list';
    for (const todo of todos) {
      const item = document.createElement('li');

      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.className = 'toggle';
      toggle.checked = todo.completed;
      toggle.addEventListener('change', () => store.toggle(todo.id));

      const label = document.createElement('label');
      label.textContent = todo.title;

      item.append(toggle, label);
      list.append(item);
    }
    root.append(list);

    const count = document.createElement('span');
    count.className = 'todo-count';
    count.textContent = `${remaining} item${remaining === 1 ? '' : 's'} left`;
    root.append(count);

    if (completed > 0) {
      const clear = document.createElement('button');
      clear.className = 'clear-completed';
      clear.textContent = 'Clear completed';
      clear.addEventListener('click', () => store.clearCompleted());
      root.append(clear);
    }
  }

  store.subscribe(render);
  render();
}
