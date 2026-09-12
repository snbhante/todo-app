"use client";

import AuthForm from "../components/AuthForm";
import PageShell from "../components/PageShell";

export default function SignupPage() {
  return (
    <PageShell mode="auth" actionLabel="Log in" actionHref="/login" eyebrow="Get started" title="Create your calm workspace">
      <AuthForm isLogin={false} />
    </PageShell>
  );
}
