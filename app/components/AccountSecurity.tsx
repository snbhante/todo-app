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
import PasswordField from "./PasswordField";

export default function AccountSecurity({ user }: { user: User }) {
  const [newEmail, setNewEmail] = useState("");
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

  const googleConnected = user.providerData.some((provider) => provider.providerId === "google.com");

  return (
    <section className="security-section" aria-labelledby="security-heading">
      <div className="security-heading"><div><p className="eyebrow">Account security</p><h3 id="security-heading">Keep your account in control</h3><p>Review sign-in methods and protect your account.</p></div><span className="security-status"><i /> Protected</span></div>

      {!user.emailVerified && <div className="security-warning"><div><strong>Email verification needed</strong><p>Verify your address to help protect your account.</p></div><button onClick={() => run("verify", async () => { await sendEmailVerification(user); setStatus("Verification email sent."); })} disabled={busy !== ""} className="button-warning disabled:opacity-50">{busy === "verify" ? "Sending..." : "Verify email"}</button></div>}

      <div className="security-disclosures">
        <details className="security-disclosure"><summary><span className="security-summary-icon">@</span><span><strong>Change email address</strong><small>Confirmation required before your email changes</small></span><b>+</b></summary><form onSubmit={(event) => { event.preventDefault(); run("email", async () => { const normalizedEmail = newEmail.trim(); if (!normalizedEmail || normalizedEmail.toLowerCase() === (user.email ?? "").toLowerCase()) throw new Error("Enter a different new email address."); await reauthenticate(); await verifyBeforeUpdateEmail(user, normalizedEmail); setNewEmail(""); setStatus("Check your new email to confirm the change."); }); }} className="security-disclosure-body"><label className="security-field-label">Current email<input value={user.email ?? ""} type="email" readOnly className="control-input w-full control-readonly" aria-label="Current email address" /></label><label className="security-field-label">New email<input value={newEmail} onChange={(event) => setNewEmail(event.target.value)} type="email" autoComplete="email" placeholder="new-email@example.com" className="control-input w-full" aria-label="New email address" /></label><label className="security-field-label">Current password<PasswordField value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" placeholder="Enter your current password" ariaLabel="Current password" /></label><button disabled={busy !== ""} className="button-primary">{busy === "email" ? "Updating..." : "Change email"}</button></form></details>
        <details className="security-disclosure"><summary><span className="security-summary-icon security-summary-icon-violet">*</span><span><strong>Change password</strong><small>Use a unique password at least 6 characters long</small></span><b>+</b></summary><form onSubmit={(event) => { event.preventDefault(); run("password", async () => { await reauthenticate(); if (newPassword.length < 6) throw new Error("weak password"); await updatePassword(user, newPassword); setCurrentPassword(""); setNewPassword(""); setStatus("Password updated successfully."); }); }} className="security-disclosure-body"><label className="security-field-label">Current password<PasswordField value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" placeholder="Current password" ariaLabel="Current password" /></label><label className="security-field-label">New password<PasswordField value={newPassword} onChange={setNewPassword} autoComplete="new-password" placeholder="New password" ariaLabel="New password" /></label><button disabled={busy !== ""} className="button-primary">{busy === "password" ? "Updating..." : "Change password"}</button></form></details>
        <div className="security-provider-row"><span className="security-summary-icon security-summary-icon-cyan">G</span><span><strong>Google sign-in</strong><small>{googleConnected ? "Connected to your account" : "Add Google for faster sign-in"}</small></span><button onClick={() => run("google", async () => { await linkWithPopup(user, new GoogleAuthProvider()); setStatus("Google account linked."); })} disabled={busy !== "" || googleConnected} className="button-quiet disabled:opacity-50">{googleConnected ? "Connected" : busy === "google" ? "Connecting..." : "Connect"}</button></div>
      </div>

      {status && <p role="status" className="alert-success">{status}</p>}
      {error && <p role="alert" className="alert-error">{error}</p>}
      <div className="security-danger-zone"><div><strong>Danger zone</strong><p>Delete your account and all associated tasks permanently.</p></div><button onClick={() => { if (window.confirm("Delete your account and all associated data? This cannot be undone.")) run("delete", async () => { await remove(ref(db, `todos/${user.uid}`)); await deleteUser(user); }); }} disabled={busy !== ""} className="button-danger disabled:opacity-50">Delete account</button></div>
    </section>
  );
}
