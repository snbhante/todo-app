"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { onValue, push, ref, remove, update } from "firebase/database";
import { auth, db } from "../../firebase";
import AddTodoForm from "./AddTodoForm";
import DropdownMenu from "./DropdownMenu";
import TodoItem, { type TodoRecord } from "./TodoItem";

type Filter = "all" | "active" | "completed";
type Sort = "newest" | "oldest" | "priority";

export default function TodoList() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<[string, TodoRecord][]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [loadError, setLoadError] = useState("");
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
      setLoadError("");
      setIsLoadingTodos(Boolean(nextUser));
      if (!nextUser) return;
      unsubscribeTodos = onValue(
        ref(db, `todos/${nextUser.uid}`),
        (snapshot) => {
          const data = snapshot.val() as Record<string, TodoRecord> | null;
          const entries = data ? Object.entries(data).filter(([, item]) => item && typeof item.text === "string") : [];
          setTodos(entries);
          setIsLoadingTodos(false);
        },
        () => {
          setTodos([]);
          setIsLoadingTodos(false);
          setLoadError("We could not read your tasks. Check your Firebase Realtime Database rules and try again.");
        },
      );
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
  if (!user) return (
    <section className="profile-access-card" aria-labelledby="task-access-title">
      <div className="profile-access-icon" aria-hidden="true">✓</div>
      <p className="eyebrow">Your private workspace</p>
      <h2 id="task-access-title" className="profile-access-title">Sign in to manage your tasks</h2>
      <p className="profile-access-copy">
        Keep your priorities, progress, and daily plans together in one focused space.
      </p>
      <div className="profile-access-actions">
        <Link href="/login" className="button-primary">Go to login</Link>
        <Link href="/signup" className="button-quiet">Create account</Link>
      </div>
      <Link href="/" className="profile-access-home">
        Return to home
      </Link>
    </section>
  );

  return (
    <section className="dashboard-panel panel mx-auto w-full max-w-5xl">
      <div className="dashboard-header"><div><p className="eyebrow">Your command center</p><h2 className="dashboard-title">Good to see you.</h2><p className="dashboard-subtitle">A clear next step makes the whole day lighter.</p></div></div>
      <div className="dashboard-stats"><div className="stat-card"><span>Total tasks</span><strong>{todos.length}</strong></div><div className="stat-card stat-success"><span>Completed</span><strong>{completedCount}</strong></div><div className="stat-card stat-accent"><span>Still to do</span><strong>{todos.length - completedCount}</strong></div></div>
      <AddTodoForm addTodo={addTodo} />
      <div className="dashboard-toolbar"><div className="filter-list">{(["all", "active", "completed"] as Filter[]).map((item) => <button key={item} onClick={() => setFilter(item)} className={`filter-button ${filter === item ? "filter-active" : ""}`}>{item[0].toUpperCase() + item.slice(1)}<span>{item === "all" ? todos.length : item === "completed" ? completedCount : todos.length - completedCount}</span></button>)}</div><div className="task-search"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" aria-label="Search tasks" className="control-input" /><DropdownMenu value={sort} onChange={setSort} label="Sort tasks" options={[{ value: "newest", label: "Newest first" }, { value: "oldest", label: "Oldest first" }, { value: "priority", label: "Priority" }]} /></div></div>
      {message && <p role="status" className="dashboard-notice">{message}</p>}
      {isLoadingTodos ? <div className="empty-state dashboard-loading"><div className="loading-spinner" aria-hidden="true" /><h3>Loading your tasks</h3><p>Syncing your workspace with Firebase.</p></div> : loadError ? <div className="empty-state dashboard-error"><div className="empty-icon">!</div><h3>Tasks could not be loaded</h3><p>{loadError}</p><button type="button" className="button-quiet" onClick={() => window.location.reload()}>Try again</button></div> : visibleTodos.length === 0 ? <div className="empty-state"><div className="empty-icon">+</div><h3>{query || filter !== "all" ? "Nothing matches this view" : "Your list is clear"}</h3><p>{query || filter !== "all" ? "Try another filter or search term." : "Add one meaningful task and make it your next win."}</p></div> : <ul className="task-list">{visibleTodos.map(([id, todo]) => <TodoItem key={id} id={id} todo={todo} toggleTodo={toggleTodo} editTodo={editTodo} deleteTodo={deleteTodo} />)}</ul>}
    </section>
  );
}