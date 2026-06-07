import { uid } from './uid.js';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type TodoStore = {
  getTodos(): readonly Todo[];
  add(title: string): Todo;
  toggle(id: string): void;
  remove(id: string): void;
  subscribe(listener: () => void): () => void;
};

export function createStore(): TodoStore {
  let todos: Todo[] = [];
  const listeners = new Set<() => void>();

  function notify(): void {
    for (const listener of listeners) {
      listener();
    }
  }

  return {
    getTodos(): readonly Todo[] {
      return todos;
    },

    add(title: string): Todo {
      const todo: Todo = {
        id: uid(),
        title: title.trim(),
        completed: false,
      };
      todos = [...todos, todo];
      notify();
      return todo;
    },

    toggle(id: string): void {
      const todo = todos.find((t) => t.id === id);
      if (!todo) {
        return;
      }
      todos = todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      );
      notify();
    },

    remove(id: string): void {
      if (!todos.some((t) => t.id === id)) {
        return;
      }
      todos = todos.filter((t) => t.id !== id);
      notify();
    },

    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
