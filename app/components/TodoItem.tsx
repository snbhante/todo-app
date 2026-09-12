"use client";

import { useState } from "react";

export type Priority = "low" | "medium" | "high";
export type TodoRecord = { text: string; done: boolean; priority?: Priority; createdAt?: number };

type TodoItemProps = {
  id: string;
  todo: TodoRecord;
  toggleTodo: (id: string, done: boolean) => void;
  editTodo: (id: string, text: string, priority: Priority) => void;
  deleteTodo: (id: string) => void;
};

export default function TodoItem({ id, todo, toggleTodo, editTodo, deleteTodo }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [priority, setPriority] = useState<Priority>(todo.priority ?? "medium");

  const save = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    editTodo(id, trimmed, priority);
    setEditing(false);
  };

  return (
    <li className="task-row">
      <button onClick={() => toggleTodo(id, todo.done)} className={`check-button ${todo.done ? "check-done" : ""}`} aria-label={todo.done ? "Mark as incomplete" : "Mark as complete"}>{todo.done ? "✓" : ""}</button>
      {editing ? <div className="min-w-0 flex-1 space-y-2"><input autoFocus value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") save(); if (event.key === "Escape") setEditing(false); }} className="control-input w-full" /><select value={priority} onChange={(event) => setPriority(event.target.value as Priority)} className="control-input"><option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option></select></div> : <div className="min-w-0 flex-1"><p className={`break-words text-base ${todo.done ? "text-slate-500 line-through" : "text-slate-100"}`}>{todo.text}</p><span className={`priority priority-${todo.priority ?? "medium"}`}>{todo.priority ?? "medium"}</span></div>}
      <div className="flex shrink-0 items-center gap-1"><button onClick={editing ? save : () => setEditing(true)} className="icon-button" aria-label={editing ? "Save task" : "Edit task"}>{editing ? "✓" : "Edit"}</button><button onClick={() => deleteTodo(id)} className="icon-button danger" aria-label="Delete task">Delete</button></div>
    </li>
  );
}
