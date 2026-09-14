import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import PasswordInput from "../../../components/PasswordInput.jsx";

const fieldStyle = {
  display: "block",
  width: "100%",
  marginTop: 6,
  padding: "9px 11px",
  borderRadius: 8,
  border: "1px solid var(--rule)",
  background: "var(--paper-2)",
  color: "var(--text)",
};

export default function ChangePassword() {
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
      // changePassword() already clears the session locally; the router
      // will redirect to /login automatically once user becomes null.
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="panel" style={{ maxWidth: 420 }}>
      <h3>Change your password</h3>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <label style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500 }}>
          Current password
          <PasswordInput value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required style={fieldStyle} />
        </label>
        <label style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500 }}>
          New password
          <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} style={fieldStyle} />
        </label>
        <label style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500 }}>
          Confirm new password
          <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} style={fieldStyle} />
        </label>
        {error && <p className="field-error form-error">{error}</p>}
        <button type="submit" className="btn-accent" disabled={busy} style={{ alignSelf: "flex-start" }}>
          <KeyRound size={15} />
          {busy ? "Saving\u2026" : "Update password"}
        </button>
      </form>
    </div>
  );
}
