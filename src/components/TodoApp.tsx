"use client";

import { useEffect, useState, type FormEvent } from "react";

type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
};

const STORAGE_KEY = "todos";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setTodos(JSON.parse(stored));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, loaded]);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      title: trimmed,
      done: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [todo, ...prev]);
    setTitle("");
  }

  function toggleDone(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTodo(id: string) {
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

      <ul className="mt-6 flex flex-col gap-2">
        {!loaded ? (
          <li className="text-sm text-zinc-500">読み込み中...</li>
        ) : todos.length === 0 ? (
          <li className="text-sm text-zinc-500">タスクはまだありません</li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleDone(todo.id)}
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

      {loaded && todos.length > 0 && (
        <p className="mt-4 text-xs text-zinc-500">
          残り {remaining} / {todos.length} 件
        </p>
      )}
    </div>
  );
}
