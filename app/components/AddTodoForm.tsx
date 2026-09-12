"use client";

import { useState } from "react";
import type { Priority } from "./TodoItem";

export default function AddTodoForm({ addTodo }: { addTodo: (text: string, priority: Priority) => void | Promise<void> }) {
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newTodo.trim();
    if (!trimmed) return;
    void addTodo(trimmed, priority);
    setNewTodo("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-white/10 bg-slate-950/45 p-3 shadow-inner shadow-slate-950/60 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-500">✦</span>
          <input
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Add a new task..."
            className="control-input w-full py-3 pl-10"
          />
        </div>
        <select value={priority} onChange={(event) => setPriority(event.target.value as Priority)} className="control-input lg:w-44" aria-label="Task priority">
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <button
          type="submit"
          className="button-primary min-h-12"
        >
          Add task
        </button>
      </div>
    </form>
  );
}
