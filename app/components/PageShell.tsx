"use client";

import Link from "next/link";

const iconPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg`;

export default function PageShell({ children, title, eyebrow }: { children: React.ReactNode; title: string; eyebrow: string }) {
  return (
    <main className="relative min-h-screen overflow-hidden px-3 py-4 sm:px-6 sm:py-8">
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/45 shadow-[0_35px_90px_rgba(15,23,42,0.8)] backdrop-blur-2xl">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3 text-white">
            <img src={iconPath} alt="Luma Todo" className="h-10 w-10" />
            <span className="font-bold tracking-tight">Luma Todo <span className="hidden text-xs font-normal text-slate-500 sm:inline">/ focus workspace</span></span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium text-slate-300 sm:gap-2">
            <Link href="/todos" className="button-quiet">Tasks</Link>
            <Link href="/profile" className="button-quiet">Profile</Link>
          </nav>
        </header>
        <div className="px-3 py-7 sm:px-8 sm:py-10 lg:px-12">
          <div className="mx-auto mb-7 max-w-3xl text-center">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
