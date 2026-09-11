"use client";

import AuthForm from "../components/AuthForm";
import PageShell from "../components/PageShell";

export default function LoginPage() {
  return (
    <PageShell eyebrow="Welcome back" title="Pick up where you left off">
      <AuthForm isLogin={true} />
    </PageShell>
  );
}
