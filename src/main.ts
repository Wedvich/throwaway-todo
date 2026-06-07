import { mountApp } from './app.js';
import { createTodoStore } from './store.js';

const app = document.querySelector<HTMLElement>('#app');

if (app) {
  const store = createTodoStore();
  mountApp(app, store);
}
