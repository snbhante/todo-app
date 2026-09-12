"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import AccountSecurity from "../components/AccountSecurity";
import PageShell from "../components/PageShell";

export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const isHydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);

  if (!isHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:p-8">
        <div className="w-full max-w-lg rounded-[28px] border border-violet-400/20 bg-slate-900/75 p-8 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-800/80" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:p-8">
        <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-8 text-center shadow-xl">
          <p className="mb-4 text-xl font-semibold text-white">Please login first.</p>
          <Link href="/login" className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 font-semibold text-white">
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <PageShell eyebrow="Account" title="Manage your Luma Todo account">
      <div className="mx-auto w-full max-w-4xl rounded-[28px] border border-violet-400/20 bg-slate-900/75 p-5 shadow-2xl shadow-violet-950/40 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-violet-300">Profile</p>
            <h2 className="mt-2 text-3xl font-bold text-white">My Account</h2>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xl font-bold text-white">
            {user.email?.charAt(0).toUpperCase() ?? "U"}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
          <div>
            <p className="text-sm text-slate-400">Email</p>
            <p className="mt-1 text-lg font-medium text-white">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Status</p>
            <p className="mt-1 text-lg font-medium text-emerald-300">Active</p>
          </div>
        </div>

        <AccountSecurity user={user} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => auth.signOut()} className="min-h-12 flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-3 font-semibold text-white">
            Logout
          </button>
          <Link href="/" className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center font-semibold text-white hover:bg-white/10">
            Back home
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
