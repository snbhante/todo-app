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
    <PageShell mode="profile" eyebrow="Your account" title="A home for your profile">
      <div className="profile-card">
        <div className="profile-hero">
          <div className="profile-hero-avatar">
            {photoUrl ? <img src={photoUrl} alt="Your profile" /> : user.email?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="profile-hero-copy"><p className="eyebrow">Personal profile</p><h2>My Account</h2><p>Keep your identity, preferences, and security in one place.</p><div className="profile-hero-meta"><span>{user.email}</span><b>Active account</b></div></div>
        </div>

        <ProfileCustomizer user={user} onPhotoChange={handlePhotoChange} />
        <AccountSecurity user={user} />

      </div>
    </PageShell>
  );
}
