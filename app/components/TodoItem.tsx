"use client";

export default function TodoItem({ id, todo, toggleTodo, deleteTodo }: any) {
  return (
    <li className="group flex items-center gap-3 rounded-[22px] border border-white/10 bg-gradient-to-r from-slate-800/90 via-slate-800/85 to-slate-900/90 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.35)] transition hover:border-violet-400/30 hover:shadow-violet-950/20">
      <button
        onClick={() => toggleTodo(id, todo.done)}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-black transition ${
          todo.done
            ? "border-emerald-400 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
            : "border-slate-600 bg-slate-950 text-slate-300 hover:border-violet-400/70"
        }`}
        aria-label={todo.done ? "Mark as incomplete" : "Mark as complete"}
      >
        ✓
      </button>

      <span
        className={`flex-1 text-left text-base ${
          todo.done ? "text-slate-400 line-through decoration-2" : "text-slate-100"
        }`}
      >
        {todo.text}
      </span>

      <button
        onClick={() => deleteTodo(id)}
        className="min-h-10 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
      >
        Delete
      </button>
    </li>
  );
}
