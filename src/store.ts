import { uid } from './uid.js';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type Listener = () => void;

export interface TodoStore {
  getTodos(): readonly Todo[];
  add(title: string): Todo;
  toggle(id: string): void;
  subscribe(listener: Listener): () => void;
}

export function createTodoStore(initial: readonly Todo[] = []): TodoStore {
  let todos: Todo[] = initial.map((todo) => ({ ...todo }));
  const listeners = new Set<Listener>();

  const notify = (): void => {
    for (const listener of listeners) {
      listener();
    }
  };

  return {
    getTodos() {
      return todos;
    },
    add(title) {
      const todo: Todo = { id: uid(), title, completed: false };
      todos = [...todos, todo];
      notify();
      return todo;
    },
    toggle(id) {
      todos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
