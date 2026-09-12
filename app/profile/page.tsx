"use client";

import Link from "next/link";
import { useCallback, useState, useSyncExternalStore } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import AccountSecurity from "../components/AccountSecurity";
import PageShell from "../components/PageShell";
import ProfileCustomizer from "../components/ProfileCustomizer";

export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const isHydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const [photoUrl, setPhotoUrl] = useState("");
  const handlePhotoChange = useCallback((nextPhotoUrl: string) => setPhotoUrl(nextPhotoUrl), []);

  if (!isHydrated) {
    return (
      <main className="page-frame flex items-center justify-center">
        <div className="panel w-full max-w-lg p-8">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-800/80" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <PageShell eyebrow="Account access" title="Your profile is waiting for you">
        <section className="profile-access-card">
          <div className="profile-access-icon" aria-hidden="true">
            ◇
          </div>
          <h2 className="profile-access-title">Sign in to open your profile</h2>
          <p className="profile-access-copy">
            Manage your account, security settings, and connected sign-in methods from one place.
          </p>
          <div className="profile-access-actions">
            <Link href="/login" className="button-primary">Go to login</Link>
            <Link href="/signup" className="button-quiet">Create account</Link>
          </div>
          <Link href="/" className="profile-access-home">
            Return to home
          </Link>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Account" title="Manage your Luma Todo account">
      <div className="profile-card">
        <div className="profile-heading">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-violet-300">Profile</p>
            <h2 className="mt-2 text-3xl font-bold text-white">My Account</h2>
          </div>
          <div className="profile-avatar">
            {photoUrl ? <img src={photoUrl} alt="Your profile" /> : user.email?.charAt(0).toUpperCase() ?? "U"}
          </div>
        </div>

        <div className="profile-summary">
          <div className="profile-info-row">
            <span className="profile-info-icon" aria-hidden="true">@</span>
            <div className="profile-info-copy"><span className="profile-info-label">Email address</span><strong>{user.email}</strong></div>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-icon profile-info-icon-success" aria-hidden="true">✓</span>
            <div className="profile-info-copy"><span className="profile-info-label">Account status</span><strong className="profile-status-pill">Active</strong></div>
          </div>
        </div>

        <ProfileCustomizer user={user} onPhotoChange={handlePhotoChange} />
        <AccountSecurity user={user} />

        <div className="profile-actions">
          <button onClick={() => auth.signOut()} className="button-danger">
            Logout
          </button>
          <Link href="/" className="button-quiet">
            Back home
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
