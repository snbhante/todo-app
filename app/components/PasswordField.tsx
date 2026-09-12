"use client";

import { useState } from "react";

type PasswordFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  ariaLabel: string;
  className?: string;
};

export default function PasswordField({ value, onChange, placeholder, autoComplete, ariaLabel, className = "" }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`control-input password-input ${className}`}
        aria-label={ariaLabel}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? `Hide ${ariaLabel}` : `Show ${ariaLabel}`}
        aria-pressed={visible}
        title={visible ? "Hide password" : "Show password"}
      >
        <span className={`password-eye-icon ${visible ? "password-eye-visible" : "password-eye-hidden"}`} aria-hidden="true" />
      </button>
    </div>
  );
}
