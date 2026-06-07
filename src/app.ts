import { Store, type Todo } from './store.js';

function renderTodo(todo: Todo, store: Store): HTMLLIElement {
  const li = document.createElement('li');
  li.className = todo.completed ? 'todo completed' : 'todo';
  li.dataset.id = todo.id;

  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.className = 'toggle';
  toggle.checked = todo.completed;
  toggle.addEventListener('change', () => {
    store.toggle(todo.id);
  });

  const label = document.createElement('label');
  label.className = 'title';
  label.textContent = todo.title;

  const destroy = document.createElement('button');
  destroy.type = 'button';
  destroy.className = 'destroy';
  destroy.textContent = '×';
  destroy.addEventListener('click', () => {
    store.remove(todo.id);
  });

  li.append(toggle, label, destroy);
  return li;
}

export function createTodoApp(root: HTMLElement, store: Store = new Store()): Store {
  const list = document.createElement('ul');
  list.className = 'todo-list';
  root.appendChild(list);

  const render = (): void => {
    list.replaceChildren(...store.getTodos().map((todo) => renderTodo(todo, store)));
  };

  store.subscribe(render);
  render();

  return store;
}
