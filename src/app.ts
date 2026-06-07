import { createStore, type Store } from './store.js';

export function mountApp(root: HTMLElement, store: Store = createStore()): void {
  root.innerHTML = '';

  const form = document.createElement('form');
  form.className = 'todo-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'title';

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Add';

  form.append(input, submit);

  const list = document.createElement('ul');
  list.className = 'todo-list';

  function render(): void {
    list.innerHTML = '';
    for (const todo of store.all()) {
      const item = document.createElement('li');
      item.textContent = todo.title;
      list.append(item);
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = input.value.trim();
    if (title === '') {
      return;
    }
    store.add(title);
    input.value = '';
    render();
  });

  root.append(form, list);
  render();
}
