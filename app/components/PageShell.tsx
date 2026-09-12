"use client";

import Link from "next/link";

const iconPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg`;

export default function PageShell({ children, title, eyebrow }: { children: React.ReactNode; title: string; eyebrow: string }) {
  return (
    <main className="page-frame">
      <div className="app-frame">
        <header className="app-header">
          <Link href="/" className="brand-link">
            <img src={iconPath} alt="Luma Todo" className="brand-mark" />
            <span className="font-bold tracking-tight">Luma Todo <span className="hidden text-xs font-normal text-slate-500 sm:inline">/ focus workspace</span></span>
          </Link>
          <nav className="app-nav">
            <Link href="/todos" className="button-quiet">Tasks</Link>
            <Link href="/profile" className="button-quiet">Profile</Link>
          </nav>
        </header>
        <div className="page-content">
          <div className="page-heading">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
