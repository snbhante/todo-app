"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import { auth } from "../firebase";
import TodoList from "./components/TodoList";

const iconPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg`;

export default function HomePage() {
  const [user] = useAuthState(auth);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-5xl rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-violet-950/50 backdrop-blur-xl sm:p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-4 inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
              Productivity Flow
            </span>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Luma Todo</h1>
          </div>
          <div className="mx-auto h-32 max-w-md animate-pulse rounded-2xl border border-white/10 bg-slate-900/60" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-6%] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-8%] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/45 shadow-[0_40px_100px_rgba(15,23,42,0.8)] backdrop-blur-2xl">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3 text-white">
            <img src={iconPath} alt="Luma Todo" className="h-11 w-11 drop-shadow-[0_8px_14px_rgba(34,211,238,0.2)]" />
            <span className="text-lg font-bold tracking-tight">Luma Todo</span>
          </Link>
          <span className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Your calm workspace
          </span>
        </header>

        <div className="px-4 py-7 sm:px-8 sm:py-10 lg:px-12">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-4 inline-flex rounded-full border border-violet-300/30 bg-violet-500/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-100">
              Productivity Flow
            </span>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Make space for what matters.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Organize your day with a calm, beautiful workspace built for focus.
            </p>
          </div>

        {user ? (
          <TodoList />
        ) : (
          <div className="mx-auto flex max-w-lg flex-col items-center gap-5 rounded-[28px] border border-white/10 bg-slate-900/60 p-8 text-center shadow-[0_20px_60px_rgba(79,70,229,0.18)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 text-2xl text-violet-200 shadow-lg shadow-violet-900/30">✓</div>
            <p className="text-xl font-semibold text-slate-100">Sign in to unlock your task board</p>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:brightness-110"
            >
              Login to continue
            </Link>
            <Link href="/signup" className="text-sm text-slate-300 underline decoration-slate-500 underline-offset-4 transition hover:text-white">
              Create an account
            </Link>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
