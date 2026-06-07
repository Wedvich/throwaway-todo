import { mountApp } from './app.js';
import { TodoStore } from './store.js';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const store = new TodoStore();
  store.add('Learn TypeScript');
  store.add('Build a todo app');
  mountApp(app, store);
}
