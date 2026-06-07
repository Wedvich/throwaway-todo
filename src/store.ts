import { uid } from './uid.js';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoStore {
  getTodos(): Todo[];
  add(title: string): Todo;
  toggle(id: string): void;
  remove(id: string): void;
  subscribe(listener: () => void): () => void;
}

export function createStore(initial: Todo[] = []): TodoStore {
  const todos: Todo[] = initial.map((todo) => ({ ...todo }));
  const listeners = new Set<() => void>();

  const notify = (): void => {
    for (const listener of listeners) listener();
  };

  return {
    getTodos: () => todos.map((todo) => ({ ...todo })),
    add(title) {
      const todo: Todo = { id: uid(), title, completed: false };
      todos.push(todo);
      notify();
      return todo;
    },
    toggle(id) {
      const todo = todos.find((item) => item.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        notify();
      }
    },
    remove(id) {
      const index = todos.findIndex((item) => item.id === id);
      if (index >= 0) {
        todos.splice(index, 1);
        notify();
      }
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
