import { mountApp } from './app.js';
import { createStore } from './store.js';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const store = createStore([
    { id: 'seed-1', title: 'Learn TypeScript', completed: false },
    { id: 'seed-2', title: 'Build a todo app', completed: false },
    { id: 'seed-3', title: 'Set up Vite', completed: true },
  ]);
  mountApp(app, store);
}
