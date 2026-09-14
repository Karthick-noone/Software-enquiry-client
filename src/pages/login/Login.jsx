import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Orbit, Lock, ArrowLeft, Headset } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";
import PasswordInput from "../../components/PasswordInput.jsx";
import logo from "../../assets/logo.png";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("login"); // login | forgot | reset

  // If already logged in (e.g. hit back button), skip straight past login.
  useEffect(() => {
    if (!user) return;
    if (user.role === "master") navigate("/master/dashboard", { replace: true });
    else if (user.role === "admin") navigate("/admin/dashboard", { replace: true });
    else navigate("/", { replace: true });
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const u = await login(username.trim(), password);
      if (u.role === "master") navigate("/master/dashboard", { replace: true });
      else if (u.role === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
   <div className="login-screen">
  <img src={logo} className="company-logo" alt="Company Logo" />
  <div className="login-card">
    <div className="login-head">
      <div className="login-mark">
        <Headset size={22} strokeWidth={2} />
      </div>
      <div>
        <h1>Software Enquiry</h1>
        <p>Sign in to your dashboard</p>
      </div>
    </div>

    {mode === "login" && (
      <>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus placeholder="your username" required/>
          </label>
          <label>
            Password
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="your password" required />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={busy}>
            <Lock size={15} strokeWidth={2} />
            {busy ? "Signing in\u2026" : "Sign in"}
          </button>
        </form>
      </>
    )}

    {mode === "forgot" && <ForgotStep onDone={() => setMode("reset")} onBack={() => setMode("login")} />}
    {mode === "reset" && <ResetStep onDone={() => setMode("login")} onBack={() => setMode("login")} />}
  </div>
</div>
  );
}

function ForgotStep({ onDone, onBack }) {
  const [username, setUsername] = useState("master");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await apiFetch("/auth/forgot-password", { method: "POST", body: { username: username.trim() } });
      setInfo(res.message);
      setTimeout(onDone, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <label>
        Master username
        <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
      </label>
      {error && <p className="login-error">{error}</p>}
      {info && <p className="login-hint" style={{ color: "#3F6B42" }}>{info}</p>}
      <button type="submit" disabled={busy}>
        {busy ? "Sending\u2026" : "Send reset code"}
      </button>
      <button type="button" className="login-back-link" onClick={onBack}>
        <ArrowLeft size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
        Back to sign in
      </button>
    </form>
  );
}

function ResetStep({ onDone, onBack }) {
  const [username, setUsername] = useState("master");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await apiFetch("/auth/reset-password", { method: "POST", body: { username: username.trim(), code: code.trim(), newPassword } });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <label>
        Master username
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Reset code
        <input value={code} onChange={(e) => setCode(e.target.value)} autoFocus placeholder="6-digit code from server console" />
      </label>
      <label>
        New password
        <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" />
      </label>
      {error && <p className="login-error">{error}</p>}
      <button type="submit" disabled={busy}>
        {busy ? "Resetting\u2026" : "Reset password"}
      </button>
      <button type="button" className="login-back-link" onClick={onBack}>
        <ArrowLeft size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
        Back to sign in
      </button>
    </form>
  );
}
