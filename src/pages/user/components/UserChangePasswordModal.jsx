import React, { useState } from "react";
import { X, KeyRound } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import PasswordInput from "../../../components/PasswordInput.jsx";

export default function UserChangePasswordModal({ onClose }) {
  const { changePassword } = useAuth();
  const { showToast } = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirm) {
      setError("New password and confirmation don't match.");
      return;
    }
    setBusy(true);
    try {
      await changePassword(oldPassword, newPassword);
      showToast("Password changed. Please log in again.");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <form className="drawer" style={{ width: "min(360px, 100%)" }} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="drawer-head">
          <h2>Change password</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>
        <label>
          Current password
          <PasswordInput value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
        </label>
        <label>
          New password
          <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
        </label>
        <label>
          Confirm new password
          <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
        </label>
        {error && <p className="field-error form-error">{error}</p>}
        <div className="drawer-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={busy}>
            <KeyRound size={15} />
            {busy ? "Saving\u2026" : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}
