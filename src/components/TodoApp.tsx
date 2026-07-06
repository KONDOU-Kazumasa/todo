"use client";

import { useEffect, useState, type FormEvent } from "react";

type Todo = {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
};

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch(() => setError("Failed to load todos"))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });

    if (!res.ok) {
      setError("Failed to add todo");
      return;
    }

    const todo = await res.json();
    setTodos((prev) => [todo, ...prev]);
    setTitle("");
  }

  async function toggleDone(todo: Todo) {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });

    if (!res.ok) {
      setError("Failed to update todo");
      return;
    }

    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function deleteTodo(id: number) {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });

    if (!res.ok) {
      setError("Failed to delete todo");
      return;
    }

    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        TODO
      </h1>

      <form onSubmit={handleAdd} className="mt-4 flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="やることを入力..."
          className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:text-zinc-50"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          追加
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <ul className="mt-6 flex flex-col gap-2">
        {loading ? (
          <li className="text-sm text-zinc-500">読み込み中...</li>
        ) : todos.length === 0 ? (
          <li className="text-sm text-zinc-500">
            タスクはまだありません
          </li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleDone(todo)}
                className="size-4 shrink-0 accent-zinc-900 dark:accent-zinc-50"
              />
              <span
                className={`flex-1 text-sm ${
                  todo.done
                    ? "text-zinc-400 line-through dark:text-zinc-600"
                    : "text-zinc-900 dark:text-zinc-50"
                }`}
              >
                {todo.title}
              </span>
              <button
                type="button"
                onClick={() => deleteTodo(todo.id)}
                aria-label="削除"
                className="text-sm text-zinc-400 transition-colors hover:text-red-600 dark:hover:text-red-400"
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>

      {!loading && todos.length > 0 && (
        <p className="mt-4 text-xs text-zinc-500">
          残り {remaining} / {todos.length} 件
        </p>
      )}
    </div>
  );
}
