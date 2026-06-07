import { uid } from './uid.js';

export interface Todo {
  id: string;
  title: string;
}

export interface Store {
  add(title: string): Todo;
  all(): Todo[];
}

export function createStore(): Store {
  const todos: Todo[] = [];
  return {
    add(title: string): Todo {
      const todo: Todo = { id: uid(), title };
      todos.push(todo);
      return todo;
    },
    all(): Todo[] {
      return [...todos];
    },
  };
}
