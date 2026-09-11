"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { onValue, push, ref, remove, update } from "firebase/database";
import { auth, db } from "../../firebase";
import AddTodoForm from "./AddTodoForm";
import TodoItem from "./TodoItem";

type TodoRecord = {
  text: string;
  done: boolean;
};

export default function TodoList() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<[string, TodoRecord][]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setTodos([]);
        return;
      }

      const todoRef = ref(db, `todos/${nextUser.uid}`);
      const unsubscribeTodos = onValue(todoRef, (snapshot) => {
        const data = snapshot.val() as Record<string, TodoRecord> | null;
        setTodos(data ? Object.entries(data) : []);
      });

      return unsubscribeTodos;
    });

    return () => unsubscribeAuth();
  }, []);

  const addTodo = async (text: string) => {
    if (!user) return;
    await push(ref(db, `todos/${user.uid}`), { text, done: false });
  };

  const toggleTodo = async (id: string, done: boolean) => {
    if (!user) return;
    await update(ref(db, `todos/${user.uid}/${id}`), { done: !done });
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;
    await remove(ref(db, `todos/${user.uid}/${id}`));
  };

  if (!isHydrated) {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-violet-400/20 bg-slate-900/75 p-5 shadow-2xl shadow-violet-950/40 backdrop-blur-xl sm:p-7">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-800/80" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-center text-white shadow-xl">
        <p className="text-lg font-medium">Please sign in to manage your todos.</p>
        <Link href="/login" className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 font-semibold text-white hover:brightness-110">
          Go to login
        </Link>
      </div>
    );
  }

  const completedCount = todos.filter(([, item]) => item.done).length;

  return (
    <div className="mx-auto w-full max-w-4xl rounded-[30px] border border-violet-400/20 bg-slate-900/75 p-5 shadow-[0_30px_80px_rgba(76,29,149,0.35)] backdrop-blur-xl sm:p-7">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-violet-300">Dashboard</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Your tasks</h2>
        </div>
        <button
          onClick={() => auth.signOut()}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        >
          Logout
        </button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-200">Total</p>
          <p className="mt-2 text-2xl font-bold text-white">{todos.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Done</p>
          <p className="mt-2 text-2xl font-bold text-white">{completedCount}</p>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Pending</p>
          <p className="mt-2 text-2xl font-bold text-white">{todos.length - completedCount}</p>
        </div>
      </div>

      <AddTodoForm addTodo={addTodo} />

      {todos.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-700 bg-slate-800/40 p-10 text-center text-slate-300">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-2xl text-violet-200">✦</div>
          <p className="text-xl font-semibold text-slate-100">No tasks yet</p>
          <p className="mt-2 text-sm text-slate-400">Add one above to get started.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {todos.map(([id, todo]) => (
            <TodoItem key={id} id={id} todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
          ))}
        </ul>
      )}

      <div className="mt-6 flex justify-end">
        <Link href="/profile" className="text-sm font-medium text-cyan-300 underline decoration-cyan-500/50 underline-offset-4 transition hover:text-cyan-200">
          View profile
        </Link>
      </div>
    </div>
  );
}