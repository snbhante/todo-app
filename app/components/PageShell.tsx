"use client";

import Link from "next/link";

const iconPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg`;

export default function PageShell({ children, title, eyebrow }: { children: React.ReactNode; title: string; eyebrow: string }) {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute left-[-12%] top-[-8%] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12%] right-[-8%] h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/45 shadow-[0_35px_90px_rgba(15,23,42,0.8)] backdrop-blur-2xl sm:rounded-[32px]">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3 text-white">
            <img src={iconPath} alt="Luma Todo" className="h-10 w-10" />
            <span className="font-bold tracking-tight">Luma Todo</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-300 sm:gap-4">
            <Link href="/todos" className="rounded-lg px-2 py-2 hover:bg-white/10 hover:text-white">Tasks</Link>
            <Link href="/profile" className="rounded-lg px-2 py-2 hover:bg-white/10 hover:text-white">Profile</Link>
          </nav>
        </header>
        <div className="px-4 py-7 sm:px-8 sm:py-10 lg:px-12">
          <div className="mx-auto mb-7 max-w-3xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
