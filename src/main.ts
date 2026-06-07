import { mountApp } from './app.js';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  mountApp(app);
}
