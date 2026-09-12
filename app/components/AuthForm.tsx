"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import PasswordField from "./PasswordField";

const iconPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg`;

export default function AuthForm({ isLogin }: { isLogin: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (isLogin) {
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      } else {
        await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      }

      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
      const messages: Record<string, string> = {
        "auth/invalid-credential": "Email or password is incorrect.",
        "auth/email-already-in-use": "An account already exists with this email.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/too-many-requests": "Too many attempts. Please try again shortly.",
      };
      setError(messages[code] ?? "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    const normalizedEmail = email.trim();
    setError("");
    setResetSent(false);
    if (!normalizedEmail) {
      setError("Enter your email address first.");
      return;
    }
    try {
      setIsSubmitting(true);
      await sendPasswordResetEmail(auth, normalizedEmail);
      setResetSent(true);
    } catch {
      setError("We could not send a reset email. Check the address and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-card text-slate-50">
      <div className="auth-header">
        <img src={iconPath} alt="Luma Todo" className="auth-logo" />
        <p className="eyebrow">Welcome</p>
        <h2 className="mt-3 text-3xl font-bold">{isLogin ? "Login" : "Create account"}</h2>
        <p className="mt-2 text-sm text-slate-400">{isLogin ? "Pick up where you left off." : "Start organizing your day."}</p>
      </div>

      <div className="form-stack">
        <label className="form-label">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="control-input w-full"
          />
        </label>

        <label className="form-label">
          <span>Password</span>
          <PasswordField value={password} onChange={setPassword} autoComplete={isLogin ? "current-password" : "new-password"} placeholder="Enter your password" ariaLabel="Password" className="w-full" />
        </label>

        {error && (
          <p role="alert" className="alert-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="button-primary auth-submit mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Create account"}
        </button>

        {isLogin && (
          <button type="button" onClick={handlePasswordReset} disabled={isSubmitting} className="password-reset-button disabled:opacity-50">
            Forgot password?
          </button>
        )}

        {resetSent && <p role="status" className="alert-success">Reset email sent. Check your inbox.</p>}

        <p className="text-center text-sm text-slate-400">
          {isLogin ? "New to Luma Todo?" : "Already have an account?"}{" "}
          <Link href={isLogin ? "/signup" : "/login"} className="font-semibold text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200">
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>
      </div>
    </form>
  );
}
