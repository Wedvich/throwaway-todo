import { uid } from './uid.js';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

type Listener = () => void;

export class TodoStore {
  private todos: Todo[] = [];
  private listeners = new Set<Listener>();

  getAll(): Todo[] {
    return this.todos.map((todo) => ({ ...todo }));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  add(title: string): Todo {
    const todo: Todo = { id: uid(), title: title.trim(), completed: false };
    this.todos.push(todo);
    this.notify();
    return { ...todo };
  }

  toggle(id: string): void {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return;
    todo.completed = !todo.completed;
    this.notify();
  }

  remove(id: string): void {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return;
    this.todos.splice(index, 1);
    this.notify();
  }

  rename(id: string, title: string): void {
    const trimmed = title.trim();
    if (trimmed === '') return;
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return;
    todo.title = trimmed;
    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
