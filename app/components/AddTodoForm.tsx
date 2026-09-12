"use client";

import { useState } from "react";
import DropdownMenu from "./DropdownMenu";
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
    <form onSubmit={handleSubmit} className="add-todo-form">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="add-todo-input-wrap">
          <span className="add-todo-input-icon" aria-hidden="true">✦</span>
          <input
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Add a new task..."
            className="add-todo-input control-input"
          />
        </div>
        <div className="priority-picker priority-picker-add">
          <DropdownMenu value={priority} onChange={setPriority} label="Task priority" options={[{ value: "low", label: "Low priority" }, { value: "medium", label: "Medium priority" }, { value: "high", label: "High priority" }]} />
        </div>
        <button type="submit" className="button-primary min-h-12 px-5">
          Add task
        </button>
      </div>
    </form>
  );
}
