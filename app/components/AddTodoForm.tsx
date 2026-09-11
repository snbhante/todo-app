"use client";

import { useState } from "react";

export default function AddTodoForm({ addTodo }: { addTodo: (text: string) => void }) {
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newTodo.trim();
    if (!trimmed) return;
    addTodo(trimmed);
    setNewTodo("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-[22px] border border-white/10 bg-slate-950/40 p-3 shadow-inner shadow-slate-950/60 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-500">✦</span>
          <input
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Add a new task..."
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 py-3 pl-10 pr-4 text-slate-50 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
        </div>
        <button
          type="submit"
          className="min-h-12 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:translate-y-[-1px] hover:brightness-110"
        >
          Add task
        </button>
      </div>
    </form>
  );
}
