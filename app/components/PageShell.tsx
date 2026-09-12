"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { onValue, ref } from "firebase/database";
import { auth } from "../../firebase";
import { db } from "../../firebase";

const iconPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg`;

type PageShellProps = {
  children: React.ReactNode;
  title: string;
  eyebrow: string;
  mode?: "workspace" | "auth" | "profile" | "tasks";
  actionLabel?: string;
  actionHref?: string;
};

export default function PageShell({ children, title, eyebrow, mode = "workspace", actionLabel, actionHref }: PageShellProps) {
  const [user] = useAuthState(auth);
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    if (!user) return;
    return onValue(ref(db, `profiles/${user.uid}/photoUrl`), (snapshot) => {
      setProfilePhoto(typeof snapshot.val() === "string" ? snapshot.val() : "");
    });
  }, [user]);

  const avatar = user ? <Link href="/profile" className="home-profile-link" aria-label="Open profile" title="Open profile">{profilePhoto ? <img src={profilePhoto} alt="" /> : <span>{user.email?.charAt(0).toUpperCase() ?? "U"}</span>}</Link> : null;

  return (
    <main className="page-frame">
      <div className="app-frame">
        <header className="app-header">
          <Link href="/" className="brand-link">
            <img src={iconPath} alt="Luma Todo" className="brand-mark" />
            <span className="brand-name">Luma Todo <span className="hidden text-xs font-normal text-slate-500 sm:inline">/ focus workspace</span></span>
          </Link>
          <nav className="app-nav">
            {mode === "workspace" ? <><Link href="/todos" className="button-quiet">Tasks</Link><Link href="/profile" className="button-quiet">Profile</Link></> : mode === "profile" ? <div className="profile-top-actions"><Link href="/todos" className="button-quiet">Tasks</Link><button type="button" onClick={() => void auth.signOut()} className="home-logout">Log out</button></div> : mode === "tasks" ? <div className="profile-top-actions">{user ? <>{avatar}<button type="button" onClick={() => void auth.signOut()} className="home-logout">Log out</button></> : <Link href="/login" className="button-quiet">Log in</Link>}</div> : actionLabel && actionHref ? <Link href={actionHref} className="button-quiet">{actionLabel}</Link> : <Link href="/" className="button-quiet">Home</Link>}
          </nav>
        </header>
        <div className="page-content">
          <div className="page-heading">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h1>
          </div>
          {children}
        </div>
        <footer className="app-footer">
          <span>Created by</span>
          <a href="https://github.com/snbhante" target="_blank" rel="noreferrer">SarbaNanda Bhikkhu</a>
        </footer>
      </div>
    </main>
  );
}
