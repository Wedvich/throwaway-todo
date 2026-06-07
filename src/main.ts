import { createTodoApp } from './app.js';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = '<h1>throwaway-todo</h1>';
  createTodoApp(app);
}
