import React from "react";
import { X, Plus, Minus } from "lucide-react";
import { STATUSES } from "../../../data/constants";
import BusinessTypeField from "../../../components/BusinessTypeField.jsx";

export default function EntryDrawer({ form, setForm, onSave, onClose, error, saving }) {
  function addPhone() {
    setForm({ ...form, secondaryPhones: [...(form.secondaryPhones || []), ""] });
  }
  function updatePhone(idx, val) {
    const next = [...(form.secondaryPhones || [])];
    next[idx] = val.replace(/[^\d]/g, "").slice(0, 10);
    setForm({ ...form, secondaryPhones: next });
  }
  function removePhone(idx) {
    const next = [...(form.secondaryPhones || [])];
    next.splice(idx, 1);
    setForm({ ...form, secondaryPhones: next });
  }
  function clearCallback() {
    setForm({ ...form, callbackDate: "", callbackTime: "" });
  }

  return (
    <div className="drawer-backdrop">
      <form className="drawer" onSubmit={onSave}>
        <div className="drawer-head">
          <h2>{form.id ? "Edit entry" : "New entry"}</h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <label>
          Customer name
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
          />
        </label>

        <div className="field-pair">
          <label>
            Phone
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^\d]/g, "").slice(0, 10) })}
              placeholder="10-digit number"
            />
            {error?.field === "phone" && <span className="field-error">{error.message}</span>}
          </label>
          <label>
            Email
            <input
              type="email"
              // required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@company.com"
            />
            {error?.field === "email" && <span className="field-error">{error.message}</span>}
          </label>
        </div>

        {(form.secondaryPhones || []).map((p, idx) => (
          <div className="phone-row" key={idx}>
            <input type="tel" value={p} onChange={(e) => updatePhone(idx, e.target.value)} placeholder="Additional number" />
            <button type="button" className="phone-remove-btn" onClick={() => removePhone(idx)} aria-label="Remove number">
              <Minus size={14} />
            </button>
          </div>
        ))}
        <button type="button" className="phone-row" onClick={addPhone} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", width: "fit-content" }}>
          <span className="phone-add-btn">
            <Plus size={14} />
          </span>
          <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Add another number</span>
        </button>

        <div className="field-pair">
          <label>
            Location
            <input
              // required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            {error?.field === "location" && <span className="field-error">{error.message}</span>}
          </label>
          <label>
            Contact Person
            <input 
            // required 
            type="text" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
            {error?.field === "contactPerson" && <span className="field-error">{error.message}</span>}
          </label>
        </div>

        <label>
          Business need
          <BusinessTypeField
            value={form.businessType}
            customValue={form.customBusinessType}
            onChange={(v) => setForm({ ...form, businessType: v })}
            onCustomChange={(v) => setForm({ ...form, customBusinessType: v })}
          />
        </label>

        <div className="field-pair">
          <label>
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Call date
            <input type="date" required value={form.callDate} onChange={(e) => setForm({ ...form, callDate: e.target.value })} />
          </label>
        </div>

        {(form.status === "Accepted" || form.status === "Delivered") && (
          <label>
            Project duration
            <input
              type="text"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="e.g. 6 weeks"
            />
          </label>
        )}

        <div className="field-pair">
          <label>
            Callback date
            <div className="input-with-clear">
              <input min={form.callDate} type="date" value={form.callbackDate} onChange={(e) => setForm({ ...form, callbackDate: e.target.value })} />
              {(form.callbackDate || form.callbackTime) && (
                <button type="button" className="input-clear-btn" onClick={clearCallback} aria-label="Clear callback">
                  <X size={13} />
                </button>
              )}
            </div>
          </label>
          <label>
            Callback time
            <input type="time" value={form.callbackTime} onChange={(e) => setForm({ ...form, callbackTime: e.target.value })} />
          </label>
        </div>

        <label>
          Notes
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="What was discussed on the call"
          />
        </label>

        {error && !error.field && <p className="field-error form-error">{error.message}</p>}

        <div className="drawer-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving\u2026" : form.id ? "Save changes" : "Add to ledger"}
          </button>
        </div>
      </form>
    </div>
  );
}