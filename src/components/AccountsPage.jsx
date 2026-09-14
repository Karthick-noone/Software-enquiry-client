import React, { useState, useEffect, useCallback } from "react";
import { Plus, KeyRound, Trash2, Pencil, UserX, UserCheck } from "lucide-react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "./ConfirmDialog.jsx";
import PasswordInput from "./PasswordInput.jsx";
import TableLoader from "./TableLoader.jsx";

const EMPTY_FORM = { id: null, name: "", username: "", password: "" };

export default function AccountsPage({ role, title, addLabel }) {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await apiFetch(`/accounts?role=${role}`, { onUnauthorized: logout });
      setAccounts(rows);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [role, logout, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setForm(EMPTY_FORM);
    setError("");
    setFormOpen(true);
  }

  function openEdit(a) {
    setForm({ id: a.id, name: a.name, username: a.username, password: "" });
    setError("");
    setFormOpen(true);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      if (form.id) {
        await apiFetch(`/accounts/${form.id}`, { method: "PUT", body: { name: form.name, username: form.username }, onUnauthorized: logout });
        showToast(`${title.slice(0, -1)} updated.`);
      } else {
        await apiFetch("/accounts", {
          method: "POST",
          body: { name: form.name, username: form.username, password: form.password, role },
          onUnauthorized: logout,
        });
        showToast(`${title.slice(0, -1)} added.`);
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitReset(e) {
    e.preventDefault();
    try {
      await apiFetch(`/accounts/${resetTarget.id}/reset-password`, { method: "POST", body: { newPassword }, onUnauthorized: logout });
      showToast("Password reset. They'll be signed out and need to log in again.");
      setResetTarget(null);
      setNewPassword("");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function confirmDelete() {
    try {
      await apiFetch(`/accounts/${deleteTarget.id}`, { method: "DELETE", onUnauthorized: logout });
      showToast(`${title.slice(0, -1)} removed.`, "info");
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  async function confirmStatusChange() {
    try {
      await apiFetch(`/accounts/${statusTarget.id}/status`, {
        method: "PATCH",
        body: { active: !statusTarget.active },
        onUnauthorized: logout,
      });
      showToast(statusTarget.active ? "Account deactivated." : "Account activated.");
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setStatusTarget(null);
    }
  }

  return (
    <div>
      <div className="toolbar-row">
        <h3 style={{ margin: 0, fontFamily: "var(--heading-font)", fontSize: 16 }}>{title}</h3>
        <button className="btn-accent" onClick={openNew}>
          <Plus size={16} />
          {addLabel}
        </button>
      </div>

      <div className="panel table-relative" style={{ padding: 0 }}>
        <TableLoader active={loading} />
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Status</th>
                <th>Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 30, color: "var(--muted)" }}>
                    No accounts yet.
                  </td>
                </tr>
              )}
              {accounts.map((a) => (
                <tr key={a.id} style={{ opacity: a.active ? 1 : 0.55 }}>
                  <td style={{ fontWeight: 600 }}>{a.name}</td>
                  <td>{a.username}</td>
                  <td>
                    <span className={`role-badge ${a.active ? "user" : "admin"}`} style={!a.active ? { background: "rgba(220,90,70,0.15)", color: "#f0a394" } : {}}>
                      {a.active ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: 12.5 }}>{new Date(a.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="icon-action-btn" onClick={() => openEdit(a)} aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                      <button className="icon-action-btn" onClick={() => setResetTarget(a)} aria-label="Reset password">
                        <KeyRound size={15} />
                      </button>
                      <button className="icon-action-btn" onClick={() => setStatusTarget(a)} aria-label={a.active ? "Deactivate" : "Activate"}>
                        {a.active ? <UserX size={15} /> : <UserCheck size={15} />}
                      </button>
                      <button className="icon-action-btn" onClick={() => setDeleteTarget(a)} aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <div className="drawer-backdrop" onClick={() => setFormOpen(false)}>
          <form className="drawer" style={{ width: "min(380px, 100%)" }} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <div className="drawer-head">
              <h2>{form.id ? "Edit account" : addLabel}</h2>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Close">
                &times;
              </button>
            </div>
            <label>
              Full name
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              Username
              <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </label>
            {!form.id && (
              <label>
                Password
                <PasswordInput
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
              </label>
            )}
            {error && <p className="field-error form-error">{error}</p>}
            <div className="drawer-actions">
              <button type="button" className="btn-outline" onClick={() => setFormOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-accent">
                {form.id ? "Save changes" : "Create account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {resetTarget && (
        <div className="drawer-backdrop" onClick={() => setResetTarget(null)}>
          <form
            className="drawer"
            style={{ width: "min(340px, 100%)" }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitReset}
          >
            <div className="drawer-head">
              <h2>Reset password</h2>
              <button type="button" onClick={() => setResetTarget(null)} aria-label="Close">
                &times;
              </button>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
              Setting a new password for <strong>{resetTarget.name}</strong>. They'll be signed out immediately.
            </p>
            <label>
              New password
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </label>
            <div className="drawer-actions">
              <button type="button" className="btn-outline" onClick={() => setResetTarget(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-accent">
                Reset password
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={`Delete this ${role}?`}
          message={`${deleteTarget.name}'s account will be permanently removed. Their past entries stay in the ledger.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {statusTarget && (
        <ConfirmDialog
          title={statusTarget.active ? "Deactivate this account?" : "Activate this account?"}
          message={
            statusTarget.active
              ? `${statusTarget.name} will be signed out immediately and won't be able to log back in until reactivated.`
              : `${statusTarget.name} will be able to log in again.`
          }
          onConfirm={confirmStatusChange}
          onCancel={() => setStatusTarget(null)}
          confirmLabel={statusTarget.active ? "Deactivate" : "Activate"}
        />
      )}
    </div>
  );
}
