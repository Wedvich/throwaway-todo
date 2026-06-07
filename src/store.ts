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

  getTodos(): readonly Todo[] {
    return this.todos;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  add(title: string): Todo {
    const todo: Todo = { id: uid(), title, completed: false };
    this.todos.push(todo);
    this.notify();
    return todo;
  }

  toggle(id: string): void {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return;
    todo.completed = !todo.completed;
    this.notify();
  }

  clearCompleted(): void {
    const remaining = this.todos.filter((t) => !t.completed);
    if (remaining.length === this.todos.length) return;
    this.todos = remaining;
    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
