import { mountApp } from './app.js';
import { createStore } from './store.js';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const store = createStore();
  mountApp(app, store);
}
