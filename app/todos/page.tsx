"use client";

import TodoList from "../components/TodoList";
import PageShell from "../components/PageShell";

export default function TodosPage() {
  return (
    <PageShell mode="tasks" eyebrow="Your task space" title="Plan your day with clarity">
      <TodoList />
    </PageShell>
  );
}
