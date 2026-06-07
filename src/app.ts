import { TodoStore, type Todo } from './store.js';

export function mountApp(root: HTMLElement, store: TodoStore): () => void {
  function renderTodo(todo: Todo): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'todo';
    li.dataset.id = todo.id;

    const title = document.createElement('label');
    title.className = 'title';
    title.textContent = todo.title;
    title.addEventListener('dblclick', () => {
      startEditing(li, todo);
    });

    li.append(title);
    return li;
  }

  function startEditing(li: HTMLLIElement, todo: Todo): void {
    const title = li.querySelector<HTMLLabelElement>('.title');
    if (!title) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit';
    input.value = todo.title;

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        store.rename(todo.id, input.value);
        render();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        render();
      }
    });

    li.replaceChild(input, title);
    input.focus();
    input.select();
  }

  function render(): void {
    const list = document.createElement('ul');
    list.className = 'todo-list';
    for (const todo of store.getAll()) {
      list.append(renderTodo(todo));
    }
    root.replaceChildren(list);
  }

  const unsubscribe = store.subscribe(render);
  render();
  return unsubscribe;
}
