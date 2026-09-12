"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { onValue, push, ref, remove, update } from "firebase/database";
import { auth, db } from "../../firebase";
import AddTodoForm from "./AddTodoForm";
import TodoItem, { type TodoRecord } from "./TodoItem";

type Filter = "all" | "active" | "completed";
type Sort = "newest" | "oldest" | "priority";

export default function TodoList() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<[string, TodoRecord][]>([]);
  const isHydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let unsubscribeTodos: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      unsubscribeTodos?.();
      unsubscribeTodos = undefined;
      setUser(nextUser);
      setTodos([]);
      if (!nextUser) return;
      unsubscribeTodos = onValue(ref(db, `todos/${nextUser.uid}`), (snapshot) => {
        const data = snapshot.val() as Record<string, TodoRecord> | null;
        setTodos(data ? Object.entries(data) : []);
      });
    });
    return () => {
      unsubscribeTodos?.();
      unsubscribeAuth();
    };
  }, []);

  const runAction = async (action: () => Promise<void>, success: string) => {
    try {
      await action();
      setMessage(success);
      window.setTimeout(() => setMessage(""), 2400);
    } catch {
      setMessage("That action could not be completed. Please try again.");
    }
  };

  const addTodo = (text: string, priority: TodoRecord["priority"]) => {
    if (!user) return;
    return runAction(() => push(ref(db, `todos/${user.uid}`), { text, done: false, priority, createdAt: Date.now() }).then(() => undefined), "Task added");
  };

  const toggleTodo = (id: string, done: boolean) => {
    if (!user) return;
    return runAction(() => update(ref(db, `todos/${user.uid}/${id}`), { done: !done }), done ? "Task reopened" : "Task completed");
  };

  const editTodo = (id: string, text: string, priority: TodoRecord["priority"]) => {
    if (!user) return;
    return runAction(() => update(ref(db, `todos/${user.uid}/${id}`), { text, priority }), "Task updated");
  };

  const deleteTodo = (id: string) => {
    if (!user) return;
    return runAction(() => remove(ref(db, `todos/${user.uid}/${id}`)), "Task deleted");
  };

  const completedCount = todos.filter(([, item]) => item.done).length;
  const visibleTodos = useMemo(() => todos
    .filter(([, item]) => filter === "all" || (filter === "completed" ? item.done : !item.done))
    .filter(([, item]) => item.text.toLowerCase().includes(query.toLowerCase().trim()))
    .sort(([, first], [, second]) => {
      if (sort === "priority") {
        const rank: Record<"high" | "medium" | "low", number> = { high: 0, medium: 1, low: 2 };
        return rank[first.priority ?? "medium"] - rank[second.priority ?? "medium"];
      }
      const firstTime = first.createdAt ?? 0;
      const secondTime = second.createdAt ?? 0;
      return sort === "newest" ? secondTime - firstTime : firstTime - secondTime;
    }), [filter, query, sort, todos]);

  if (!isHydrated) return <div className="panel mx-auto h-96 w-full max-w-5xl animate-pulse" />;
  if (!user) return <div className="panel mx-auto flex max-w-lg flex-col items-center gap-4 p-8 text-center"><p className="text-lg font-semibold text-white">Sign in to manage your workspace.</p><Link href="/login" className="button-primary">Go to login</Link></div>;

  return (
    <section className="panel mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Your command center</p><h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Good to see you.</h2><p className="mt-2 text-sm text-slate-400">A clear next step makes the whole day lighter.</p></div><div className="flex items-center gap-2"><Link href="/profile" className="button-quiet">Profile</Link><button onClick={() => auth.signOut()} className="button-quiet">Log out</button></div></div>
      <div className="mb-6 grid gap-3 sm:grid-cols-3"><div className="stat-card"><span>Total tasks</span><strong>{todos.length}</strong></div><div className="stat-card stat-success"><span>Completed</span><strong>{completedCount}</strong></div><div className="stat-card stat-accent"><span>Still to do</span><strong>{todos.length - completedCount}</strong></div></div>
      <AddTodoForm addTodo={addTodo} />
      <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2">{(["all", "active", "completed"] as Filter[]).map((item) => <button key={item} onClick={() => setFilter(item)} className={`filter-button ${filter === item ? "filter-active" : ""}`}>{item[0].toUpperCase() + item.slice(1)}<span>{item === "all" ? todos.length : item === "completed" ? completedCount : todos.length - completedCount}</span></button>)}</div><div className="flex flex-col gap-2 sm:flex-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" aria-label="Search tasks" className="control-input" /><select value={sort} onChange={(event) => setSort(event.target.value as Sort)} aria-label="Sort tasks" className="control-input"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="priority">Priority</option></select></div></div>
      {message && <p role="status" className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{message}</p>}
      {visibleTodos.length === 0 ? <div className="empty-state"><div className="empty-icon">+</div><h3>{query || filter !== "all" ? "Nothing matches this view" : "Your list is clear"}</h3><p>{query || filter !== "all" ? "Try another filter or search term." : "Add one meaningful task and make it your next win."}</p></div> : <ul className="space-y-3">{visibleTodos.map(([id, todo]) => <TodoItem key={id} id={id} todo={todo} toggleTodo={toggleTodo} editTodo={editTodo} deleteTodo={deleteTodo} />)}</ul>}
    </section>
  );
}