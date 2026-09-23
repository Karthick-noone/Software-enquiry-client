import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header.jsx";
import StatStrip from "./components/StatStrip.jsx";
import TrendChart from "./components/TrendChart.jsx";
import Filters from "./components/Filters.jsx";
import LedgerTable from "./components/LedgerTable.jsx";
import EntryDrawer from "./components/EntryDrawer.jsx";
import Pagination from "../../components/Pagination.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import TableLoader from "../../components/TableLoader.jsx";
import { apiFetch } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { BUSINESS_TYPES } from "../../data/constants";
import { todayISO } from "../../utils/helpers";

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
  status: "Pending",
  duration: "",
  notes: "",
  callDate: "",
  callbackDate: "",
  callbackTime: "",
};

export default function UserApp() {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, byStatus: {} });
  const [trendData, setTrendData] = useState([]);
  const [trendRange, setTrendRange] = useState("week");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [contactPersonFilter, setContactPersonFilter] = useState("All");
  const [contactPersons, setContactPersons] = useState([]);
  const [addedByFilter, setAddedByFilter] = useState("All");
  const [addedByNames, setAddedByNames] = useState([]);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Date filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function clearAllFilters() {
    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setContactPersonFilter("All");
    setAddedByFilter("All");
    setSort("newest");
    setDateFrom("");
    setDateTo("");
  }


  const loadEntries = useCallback(async () => {
    const params = new URLSearchParams({
      search: debouncedSearch,
      businessType: typeFilter,
      status: statusFilter,
      contactPerson: contactPersonFilter,
      addedBy: addedByFilter,
      sort,
      page: String(page),
      pageSize: String(pageSize),
    });

    // Add date filters to params if they exist
    if (dateFrom) params.append("dateFrom", dateFrom);
    if (dateTo) params.append("dateTo", dateTo);

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
  }, [debouncedSearch, typeFilter, statusFilter, contactPersonFilter, addedByFilter, sort, page, pageSize, dateFrom, dateTo, logout, showToast]);

  useEffect(() => {
    Promise.all([
      apiFetch("/entries/contact-persons", { onUnauthorized: logout }),
      apiFetch("/entries/added-by", { onUnauthorized: logout }),
    ]).then(([persons, names]) => {
      setContactPersons(persons);
      setAddedByNames(names);
    }).catch(() => {});
  }, [logout]);

  const loadStats = useCallback(async () => {
    try {
      const s = await apiFetch("/entries/stats", { onUnauthorized: logout });
      setStats(s);
    } catch (e) {
      /* ignore */
    }
  }, [logout]);

  const loadTrend = useCallback(async () => {
    try {
      const t = await apiFetch(`/entries/trend?range=${trendRange}`, { onUnauthorized: logout });
      console.log("Trend data:", t); // Debugging line to check the fetched trend data
      setTrendData(t);
    } catch (e) {
      /* ignore */
    }
  }, [trendRange, logout]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, typeFilter, statusFilter, contactPersonFilter, addedByFilter, sort, pageSize, dateFrom, dateTo]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    loadStats();
    loadTrend();
  }, [loadStats, loadTrend, refreshKey]);

  function openNew() {
    const defaultContactPerson = contactPersons.find((person) => person.trim().toLowerCase() === "issac") || "";
    setForm({ ...EMPTY_FORM, contactPerson: defaultContactPerson, callDate: todayISO() });
    setFormError(null);
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
    setFormError(null);
    setDrawerOpen(true);
  }

  async function saveEntry(e) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {

      if (form.id) {
        await apiFetch(`/entries/${form.id}`, { method: "PUT", body: form, onUnauthorized: logout });
        showToast("Entry updated.");
      } else {

        await apiFetch("/entries", { method: "POST", body: form, onUnauthorized: logout });
        showToast("Entry added to the ledger.");
      }
      setDrawerOpen(false);
      loadEntries();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setFormError({ message: err.message, field: err.field, index: err.index });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await apiFetch(`/entries/${pendingDelete.id}`, { method: "DELETE", onUnauthorized: logout });
      showToast("Entry deleted.", "info");
      loadEntries();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div className="ledger-app">
      <Header onNew={openNew} />
      <StatStrip stats={stats} />
      <TrendChart
        trendData={trendData}
        trendRange={trendRange}
        setTrendRange={setTrendRange}
        thisWeek={stats.thisWeek}
        thisMonth={stats.thisMonth}
      />
      <Filters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        contactPersonFilter={contactPersonFilter}
        setContactPersonFilter={setContactPersonFilter}
        contactPersons={contactPersons}
        addedByFilter={addedByFilter}
        setAddedByFilter={setAddedByFilter}
        addedByNames={addedByNames}
        onClearAll={clearAllFilters}
        sort={sort}
        setSort={setSort}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />
      <div className="table-relative">
        <TableLoader active={tableLoading} />
        <LedgerTable rows={rows} page={page} pageSize={pageSize} totalCount={total} onEdit={openEdit} onDelete={setPendingDelete} onNew={openNew} />
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {drawerOpen && (
        <EntryDrawer
          form={form}
          setForm={setForm}
          onSave={saveEntry}
          onClose={() => setDrawerOpen(false)}
          onClearError={() => setFormError(null)}
          error={formError}
          saving={saving}
          contactPersons={contactPersons}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this entry?"
          message={`${pendingDelete.name}'s record will be permanently removed from the ledger.`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}