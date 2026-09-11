"use client";

import TodoList from "../components/TodoList";
import PageShell from "../components/PageShell";

export default function TodosPage() {
  return (
    <PageShell eyebrow="Your workspace" title="Everything you need, in one place">
      <TodoList />
    </PageShell>
  );
}
