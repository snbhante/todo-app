"use client";

import { useSyncExternalStore } from "react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import { onValue, ref } from "firebase/database";
import { auth, db } from "../firebase";
import TodoList from "./components/TodoList";

const iconPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg`;

export default function HomePage() {
  const [user] = useAuthState(auth);
  const [profilePhoto, setProfilePhoto] = useState("");
  const isHydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);

  useEffect(() => {
    if (!user) {
      return;
    }
    return onValue(ref(db, `profiles/${user.uid}/photoUrl`), (snapshot) => {
      setProfilePhoto(typeof snapshot.val() === "string" ? snapshot.val() : "");
    });
  }, [user]);

  if (!isHydrated) {
    return (
      <main className="page-frame flex items-center justify-center">
        <div className="app-frame max-w-5xl p-6 sm:p-8">
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
    <main className="page-frame flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-6%] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-8%] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="app-frame">
        <header className="app-header">
          <Link href="/" className="brand-link">
            <img src={iconPath} alt="Luma Todo" className="brand-mark" />
            <span className="brand-name">Luma Todo</span>
          </Link>
          {!user ? <div className="home-header-action"><span>Already have an account?</span><Link href="/login" className="button-quiet">Log in</Link></div> : <div className="home-auth-actions"><Link href="/profile" className="home-profile-link" aria-label="Open profile" title="Open profile">{profilePhoto ? <img src={profilePhoto} alt="" /> : <span>{user.email?.charAt(0).toUpperCase() ?? "U"}</span>}</Link><button type="button" onClick={() => void auth.signOut()} className="home-logout">Log out</button></div>}
        </header>

        <div className="page-content">
          <div className="page-heading mb-8">
            <span className="eyebrow">A quieter way to get things done</span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Make space for what matters.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">A calm, beautifully organized workspace for the tasks that deserve your attention.</p>
          </div>

        {user ? (
          <TodoList />
        ) : (
          <section className="home-access-card" aria-labelledby="home-access-title">
            <div className="home-access-icon" aria-hidden="true">✓</div>
            <p className="eyebrow">Start with one clear next step</p>
            <h2 id="home-access-title" className="profile-access-title">Sign in to unlock your task board</h2>
            <p className="profile-access-copy">Keep your priorities, progress, and daily plans together in one focused space.</p>
            <div className="profile-access-actions">
              <Link href="/login" className="button-primary">Login to continue</Link>
              <Link href="/signup" className="button-quiet">Create an account</Link>
            </div>
            <div className="home-access-benefits"><span><b>✓</b> Live sync</span><span><b>✓</b> Private space</span><span><b>✓</b> Simple focus</span></div>
          </section>
        )}
        </div>
        <footer className="app-footer">
          <span>Created by</span>
          <a href="https://github.com/snbhante" target="_blank" rel="noreferrer">SarbaNanda Bhikkhu</a>
        </footer>
      </div>
    </main>
  );
}
