import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, PhoneCall, X, Minus } from "lucide-react";
import { apiFetch } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import Pagination from "../../../components/Pagination.jsx";
import SortDropdown from "../../../components/SortDropdown.jsx";
import ConfirmDialog from "../../../components/ConfirmDialog.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import BusinessTypeField from "../../../components/BusinessTypeField.jsx";
import TableLoader from "../../../components/TableLoader.jsx";
import { fmtDate, fmtTime, displayBusinessType, todayISO } from "../../../utils/helpers";
import { BUSINESS_TYPES, STATUSES } from "../../../data/constants";

const EMPTY_FORM = {
  id: null,
  name: "",
  phone: "",
  secondaryPhones: [],
  email: "",
  location: "",
  contactPerson: "",
  businessType: BUSINESS_TYPES[0],
  customBusinessType: "",
  status: "New",
  duration: "",
  notes: "",
  callDate: "",
  callbackDate: "",
  callbackTime: "",
};

export default function Clients() {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams({
      search: debouncedSearch,
      businessType: typeFilter,
      status: statusFilter,
      sort,
      page: String(page),
      pageSize: String(pageSize),
      dateFrom,
      dateTo,
    });
    setTableLoading(true);
    try {
      const res = await apiFetch(`/entries?${params}`, { onUnauthorized: logout });
      setRows(res.data);
      setTotal(res.total);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setTableLoading(false);
    }
  }, [debouncedSearch, typeFilter, statusFilter, sort, page, pageSize, dateFrom, dateTo, logout, showToast]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, typeFilter, statusFilter, sort, pageSize, dateFrom, dateTo]);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setForm({ ...EMPTY_FORM, callDate: todayISO() });
    setError(null);
    setDrawerOpen(true);
  }

  function openEdit(c) {
    setForm({
      id: c.id,
      name: c.name,
      phone: c.phone,
      secondaryPhones: c.secondary_phones || [],
      email: c.email,
      location: c.location,
      contactPerson: c.contactPerson,
      businessType: c.business_type,
      customBusinessType: c.custom_business_type || "",
      status: c.status,
      duration: c.duration || "",
      notes: c.notes || "",
      callDate: c.call_date,
      callbackDate: c.callback_date || "",
      callbackTime: c.callback_time || "",
    });
    setError(null);
    setDrawerOpen(true);
  }

  async function saveEntry(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (form.id) {
        await apiFetch(`/entries/${form.id}`, { method: "PUT", body: form, onUnauthorized: logout });
        showToast("Entry updated.");
      } else {
        await apiFetch("/entries", { method: "POST", body: form, onUnauthorized: logout });
        showToast("Entry added.");
      }
      setDrawerOpen(false);
      load();
    } catch (err) {
      setError({ message: err.message, field: err.field });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    try {
      await apiFetch(`/entries/${pendingDelete.id}`, { method: "DELETE", onUnauthorized: logout });
      showToast("Entry deleted.", "info");
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setPendingDelete(null);
    }
  }

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
    <div>
      <div className="toolbar-row">
        <div className="form-inline" style={{ flex: 1 }}>
          <div className="form-inline" style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 11, color: "var(--muted)" }} />
            <input
              style={{ paddingLeft: 32, minWidth: 200 }}
              placeholder="Search name, phone or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All business types</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="From date" />
          <input min={dateFrom} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} title="To date" />
          {(dateFrom || dateTo) && (
            <button
              className="icon-action-btn"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              aria-label="Clear date filter"
            >
              <X size={15} />
            </button>
          )}
          <SortDropdown sort={sort} setSort={setSort} />
        </div>
        <button className="btn-accent" onClick={openNew}>
          <Plus size={16} />
          Add entry
        </button>
      </div>

      <div className="panel table-relative" style={{ padding: 0 }}>
        <TableLoader active={tableLoading} />
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact User</th>
                {/* <th>Business need</th> */}
                <th>Status</th>
                <th>Call date</th>
                <th>Callback</th>
                <th>Added by</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !tableLoading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
                    No entries found.
                  </td>
                </tr>
              )}
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      {c.phone} &middot; {c.email}
                    </div>
                  </td>
                  <td>{c.contactPerson || '-'}</td>

                  {/* <td>{displayBusinessType(c)}</td> */}
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td style={{ fontFamily: "var(--mono-font)", fontSize: 12.5 }}>{fmtDate(c.call_date)}</td>
                  <td style={{ fontSize: 12.5 }}>
                    {c.callback_date ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <PhoneCall size={11} /> 
                       {fmtDate(c.callback_date)} {fmtTime(c.callback_time)}
                      </span>
                    ) : (
                      "\u2014"
                    )}
                  </td>
                  <td style={{ fontSize: 12.5, color: "var(--muted)" }}>{c.created_by_name}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="icon-action-btn" onClick={() => openEdit(c)} aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                      <button className="icon-action-btn" onClick={() => setPendingDelete(c)} aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>

      {drawerOpen && (
        <div className="drawer-backdrop"
        //  onClick={() => setDrawerOpen(false)}
         >
          <form className="drawer" onClick={(e) => e.stopPropagation()} onSubmit={saveEntry}>
            <div className="drawer-head">
              <h2>{form.id ? "Edit entry" : "New entry"}</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <label>
              Customer name
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <div className="field-pair">
              <label>
                Phone
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^\d]/g, "").slice(0, 10) })}
                />
                {error?.field === "phone" && <span className="field-error">{error.message}</span>}
              </label>
              <label>
                Email
                <input 
                // required 
                type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {error?.field === "email" && <span className="field-error">{error.message}</span>}
              </label>
            </div>
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
                //  required
                  type="text" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
                {error?.field === "contactPerson" && <span className="field-error">{error.message}</span>}
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
            <button
              type="button"
              onClick={addPhone}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, width: "fit-content" }}
            >
              <span className="phone-add-btn">
                <Plus size={14} />
              </span>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Add another number</span>
            </button>

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
                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 6 weeks" />
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
              <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </label>
            {error && !error.field && <p className="field-error form-error">{error.message}</p>}
            <div className="drawer-actions">
              <button type="button" className="btn-outline" onClick={() => setDrawerOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-accent" disabled={saving}>
                {saving ? "Saving\u2026" : form.id ? "Save changes" : "Add entry"}
              </button>
            </div>
          </form>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this entry?"
          message={`${pendingDelete.name}'s record will be permanently removed.`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
