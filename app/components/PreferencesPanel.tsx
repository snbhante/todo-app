"use client";

import { useEffect, useState } from "react";
import { onValue, ref, update } from "firebase/database";
import type { User } from "firebase/auth";
import DropdownMenu from "./DropdownMenu";
import { themeStore, type ThemeMode } from "../lib/theme";
import { db } from "../../firebase";

type PreferenceRecord = { theme?: ThemeMode; reducedMotion?: boolean };

export default function PreferencesPanel({ user }: { user: User }) {
  const [preferences, setPreferences] = useState(themeStore.getSnapshot());
  const [status, setStatus] = useState("");

  useEffect(() => themeStore.subscribe(() => setPreferences(themeStore.getSnapshot())), []);

  useEffect(() => onValue(ref(db, `profiles/${user.uid}/preferences`), (snapshot) => {
    const saved = snapshot.val() as PreferenceRecord | null;
    if (saved?.theme === "light" || saved?.theme === "dark" || saved?.theme === "system") themeStore.setTheme(saved.theme);
    if (typeof saved?.reducedMotion === "boolean") themeStore.setReducedMotion(saved.reducedMotion);
  }), [user.uid]);

  const savePreference = async (patch: Partial<PreferenceRecord>) => {
    try {
      await update(ref(db, `profiles/${user.uid}/preferences`), patch);
      setStatus("Preferences saved.");
      window.setTimeout(() => setStatus(""), 2200);
    } catch {
      setStatus("Preferences could not be saved.");
    }
  };

  const changeTheme = (theme: ThemeMode) => {
    themeStore.setTheme(theme);
    void savePreference({ theme });
  };

  const changeMotion = (reducedMotion: boolean) => {
    themeStore.setReducedMotion(reducedMotion);
    void savePreference({ reducedMotion });
  };

  return (
    <section className="preferences-section" aria-labelledby="preferences-title">
      <div className="preferences-heading"><div><p className="eyebrow">Preferences</p><h3 id="preferences-title">Make Luma work your way</h3><p>Choose how the app looks and moves for you.</p></div><span className="preferences-icon" aria-hidden="true">✦</span></div>
      <div className="preferences-list">
        <div className="preference-row"><div><strong>Appearance</strong><small>Use your device setting or choose a theme.</small></div><DropdownMenu value={preferences.theme} onChange={changeTheme} label="Appearance theme" options={[{ value: "system", label: "System" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} /></div>
        <label className="preference-row preference-toggle-row"><span><strong>Reduce motion</strong><small>Use fewer animations and transitions.</small></span><input type="checkbox" checked={preferences.reducedMotion} onChange={(event) => changeMotion(event.target.checked)} className="preference-toggle" /></label>
      </div>
      {status && <p role="status" className={status.includes("could") ? "alert-error" : "alert-success"}>{status}</p>}
    </section>
  );
}
