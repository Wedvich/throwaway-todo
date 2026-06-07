import type { TodoStore } from './store.js';

export function mountApp(root: HTMLElement, store: TodoStore): void {
  const list = document.createElement('ul');
  list.className = 'todo-list';
  root.appendChild(list);

  function render(): void {
    list.replaceChildren();
    for (const todo of store.getTodos()) {
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
