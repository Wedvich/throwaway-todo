import { uid } from './uid.js';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

type Listener = () => void;

export class Store {
  private todos: Todo[] = [];
  private listeners = new Set<Listener>();

  getTodos(): readonly Todo[] {
    return this.todos;
  }

  add(title: string): Todo {
    const todo: Todo = { id: uid(), title, completed: false };
    this.todos = [...this.todos, todo];
    this.emit();
    return todo;
  }

  toggle(id: string): void {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );
    this.emit();
  }

  remove(id: string): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.emit();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
