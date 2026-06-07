import type { TodoStore } from './store.js';

export function mountApp(root: HTMLElement, store: TodoStore): void {
  const list = document.createElement('ul');
  list.className = 'todo-list';
  root.appendChild(list);

  const render = (): void => {
    list.replaceChildren();
    for (const todo of store.getTodos()) {
      const item = document.createElement('li');
      item.dataset.id = todo.id;
      if (todo.completed) {
        item.classList.add('completed');
      }
      item.textContent = todo.title;
      list.appendChild(item);
    }
  };

  render();
  store.subscribe(render);
}
