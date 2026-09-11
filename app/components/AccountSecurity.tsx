"use client";

import { useState } from "react";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  deleteUser,
  linkWithPopup,
  reauthenticateWithCredential,
  sendEmailVerification,
  updatePassword,
  verifyBeforeUpdateEmail,
  type User,
} from "firebase/auth";
import { ref, remove } from "firebase/database";
import { db } from "../../firebase";

export default function AccountSecurity({ user }: { user: User }) {
  const [email, setEmail] = useState(user.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  const run = async (action: string, callback: () => Promise<void>) => {
    setBusy(action);
    setStatus("");
    setError("");
    try {
      await callback();
    } catch (caught: unknown) {
      const code = typeof caught === "object" && caught !== null && "code" in caught ? String(caught.code) : "";
      const messages: Record<string, string> = {
        "auth/requires-recent-login": "Please sign in again before changing sensitive account details.",
        "auth/wrong-password": "The current password is incorrect.",
        "auth/weak-password": "Choose a stronger password with at least 6 characters.",
        "auth/email-already-in-use": "That email address is already in use.",
        "auth/popup-closed-by-user": "The account linking window was closed.",
      };
      setError(messages[code] ?? (caught instanceof Error && caught.message !== "weak password" ? caught.message : "Something went wrong. Please try again."));
    } finally {
      setBusy("");
    }
  };

  const reauthenticate = () => {
    if (!user.email || !currentPassword) throw new Error("Password required");
    return reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
  };

  return (
    <section className="mt-5 space-y-4" aria-labelledby="security-heading">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-violet-300">Account security</p>
        <h3 id="security-heading" className="mt-1 text-xl font-semibold text-white">Keep your account in control</h3>
      </div>

      {!user.emailVerified && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-amber-100">Email address not verified</p>
            <p className="mt-1 text-sm text-amber-200/70">Verify your email to help protect your account.</p>
          </div>
          <button onClick={() => run("verify", async () => { await sendEmailVerification(user); setStatus("Verification email sent."); })} disabled={busy !== ""} className="min-h-11 rounded-xl border border-amber-300/30 px-4 py-2 text-sm font-semibold text-amber-100 disabled:opacity-50">
            {busy === "verify" ? "Sending..." : "Send email"}
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={(event) => { event.preventDefault(); run("email", async () => { await reauthenticate(); await verifyBeforeUpdateEmail(user, email.trim()); setStatus("Check your new email to confirm the change."); }); }} className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
          <div>
            <h4 className="font-semibold text-white">Email address</h4>
            <p className="mt-1 text-sm text-slate-400">A confirmation link will be sent before it changes.</p>
          </div>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white" aria-label="New email address" />
          <input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" autoComplete="current-password" placeholder="Current password" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white placeholder:text-slate-500" aria-label="Current password" />
          <button disabled={busy !== ""} className="min-h-11 w-full rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 font-semibold text-cyan-100 disabled:opacity-50">{busy === "email" ? "Updating..." : "Change email"}</button>
        </form>

        <form onSubmit={(event) => { event.preventDefault(); run("password", async () => { await reauthenticate(); if (newPassword.length < 6) throw new Error("weak password"); await updatePassword(user, newPassword); setCurrentPassword(""); setNewPassword(""); setStatus("Password updated successfully."); }); }} className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
          <div>
            <h4 className="font-semibold text-white">Password</h4>
            <p className="mt-1 text-sm text-slate-400">Use a unique password you do not reuse elsewhere.</p>
          </div>
          <input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" autoComplete="current-password" placeholder="Current password" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white placeholder:text-slate-500" aria-label="Current password" />
          <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" autoComplete="new-password" placeholder="New password" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white placeholder:text-slate-500" aria-label="New password" />
          <button disabled={busy !== ""} className="min-h-11 w-full rounded-xl border border-violet-400/30 bg-violet-400/10 px-4 py-2 font-semibold text-violet-100 disabled:opacity-50">{busy === "password" ? "Updating..." : "Change password"}</button>
        </form>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-semibold text-white">Connected accounts</h4>
          <p className="mt-1 text-sm text-slate-400">Add Google as a sign-in option for quicker access.</p>
        </div>
        <button onClick={() => run("google", async () => { await linkWithPopup(user, new GoogleAuthProvider()); setStatus("Google account linked."); })} disabled={busy !== "" || user.providerData.some((provider) => provider.providerId === "google.com")} className="min-h-11 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {user.providerData.some((provider) => provider.providerId === "google.com") ? "Google connected" : busy === "google" ? "Connecting..." : "Connect Google"}
        </button>
      </div>

      {status && <p role="status" className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-200">{status}</p>}
      {error && <p role="alert" className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-200">{error}</p>}

      <button onClick={() => { if (window.confirm("Delete your account and all associated data? This cannot be undone.")) run("delete", async () => { await remove(ref(db, `todos/${user.uid}`)); await deleteUser(user); }); }} disabled={busy !== ""} className="w-full rounded-xl border border-rose-400/20 px-4 py-3 text-sm font-semibold text-rose-300 hover:bg-rose-500/10 disabled:opacity-50">Delete account</button>
    </section>
  );
}
