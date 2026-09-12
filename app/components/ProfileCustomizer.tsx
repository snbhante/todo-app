"use client";

import { useEffect, useState } from "react";
import { onValue, ref, set } from "firebase/database";
import type { User } from "firebase/auth";
import { db } from "../../firebase";

const MAX_BIO_LENGTH = 150;
const MAX_IMAGE_BYTES = 350 * 1024;

type ProfileRecord = {
  bio?: string;
  photoUrl?: string;
};

type ProfileCustomizerProps = {
  user: User;
  onPhotoChange: (photoUrl: string) => void;
};

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "code" in error && error.code === "PERMISSION_DENIED") {
    return "Your profile could not be saved. Check your Firebase database rules.";
  }
  return "Your profile could not be saved. Please try again.";
};

const compressImage = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error("The image could not be read."));
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => reject(new Error("Please choose a valid image file."));
    image.onload = () => {
      const size = 512;
      const scale = Math.min(size / image.width, size / image.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Image compression is not supported in this browser."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };
    image.src = String(reader.result);
  };
  reader.readAsDataURL(file);
});

export default function ProfileCustomizer({ user, onPhotoChange }: ProfileCustomizerProps) {
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onValue(ref(db, `profiles/${user.uid}`), (snapshot) => {
      const profile = snapshot.val() as ProfileRecord | null;
      const nextPhoto = profile?.photoUrl ?? "";
      setBio(profile?.bio ?? "");
      setPhotoUrl(nextPhoto);
      setLinkInput(nextPhoto.startsWith("http") ? nextPhoto : "");
      onPhotoChange(nextPhoto);
    });
    return unsubscribe;
  }, [onPhotoChange, user.uid]);

  const saveProfile = async (nextBio: string, nextPhoto: string) => {
    setBusy(true);
    setStatus("");
    setError("");
    try {
      await set(ref(db, `profiles/${user.uid}`), { bio: nextBio.slice(0, MAX_BIO_LENGTH), photoUrl: nextPhoto, updatedAt: Date.now() });
      setBio(nextBio.slice(0, MAX_BIO_LENGTH));
      setPhotoUrl(nextPhoto);
      onPhotoChange(nextPhoto);
      setStatus("Profile updated successfully.");
    } catch (caught: unknown) {
      setError(getErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setBusy(true);
    setStatus("");
    setError("");
    try {
      const compressed = await compressImage(file);
      const bytes = Math.ceil((compressed.length * 3) / 4);
      if (bytes > MAX_IMAGE_BYTES) throw new Error("Choose a smaller image.");
      await saveProfile(bio, compressed);
      setLinkInput("");
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "The image could not be uploaded.");
      setBusy(false);
    }
  };

  const saveLink = () => {
    try {
      const url = new URL(linkInput.trim());
      if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
      void saveProfile(bio, url.toString());
    } catch {
      setError("Enter a valid http:// or https:// image link.");
    }
  };

  const removePhoto = () => {
    setLinkInput("");
    void saveProfile(bio, "");
  };

  return (
    <section className="profile-customizer" aria-labelledby="profile-customizer-title">
      <div className="customizer-heading">
        <div><p className="eyebrow">Personal details</p><h3 id="profile-customizer-title">Make your profile yours</h3><p>Choose a photo and a short introduction for your workspace.</p></div>
        <div className="profile-preview">{photoUrl ? <img src={photoUrl} alt="Profile preview" /> : <span>{user.email?.charAt(0).toUpperCase() ?? "U"}</span>}</div>
      </div>

      <div className="profile-photo-grid">
        <div className="profile-option-card"><div><h4>Upload a photo</h4><p>We resize it to 512px and compress it before saving.</p></div><label className="button-primary profile-file-button">Choose image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void handleFile(event.target.files?.[0])} disabled={busy} /></label></div>
        <div className="profile-option-card"><div><h4>Use an image link</h4><p>Paste a public image URL from another service.</p></div><div className="profile-link-row"><input value={linkInput} onChange={(event) => setLinkInput(event.target.value)} placeholder="https://..." aria-label="Profile image URL" className="control-input" /><button type="button" onClick={saveLink} disabled={busy} className="button-quiet">Use link</button></div></div>
      </div>

      {photoUrl && <div className="profile-photo-actions"><button type="button" onClick={removePhoto} disabled={busy} className="profile-remove-button">Remove profile image</button><span>Use your initials whenever you want a fresh start.</span></div>}

      <label className="profile-bio-field"><span>Bio <small>{bio.length}/{MAX_BIO_LENGTH}</small></span><textarea value={bio} maxLength={MAX_BIO_LENGTH} onChange={(event) => setBio(event.target.value)} placeholder="A little about you..." rows={4} className="control-input" /></label>
      <div className="profile-save-row"><button type="button" onClick={() => void saveProfile(bio, photoUrl)} disabled={busy} className="button-primary">{busy ? "Saving..." : "Save profile"}</button>{status && <p role="status" className="alert-success">{status}</p>}{error && <p role="alert" className="alert-error">{error}</p>}</div>
    </section>
  );
}
