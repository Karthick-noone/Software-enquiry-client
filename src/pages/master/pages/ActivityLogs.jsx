import React, { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import TableLoader from "../../../components/TableLoader.jsx";
import { fmtDateTime } from "../../../utils/helpers";

export default function ActivityLogs() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });

  const load = useCallback(async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const data = await apiFetch(
        `/accounts/activity-logs?page=${page}&pageSize=${pageSize}`,
        { onUnauthorized: logout }
      );
      setRows(data.data || []);
      setPagination(data.pagination || {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
      });
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [logout, showToast]);

  useEffect(() => {
    load(pagination.page, pagination.pageSize);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      load(newPage, pagination.pageSize);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    load(1, newSize); // Reset to first page when changing page size
  };

  return (
    <div>
      <div className="toolbar-row">
        <h3 style={{ margin: 0, fontFamily: "var(--heading-font)", fontSize: 16 }}>
          Login activity
        </h3>
        {/* Page size selector */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: 13, color: "var(--muted)" }}>Rows per page:</label>
          <select
            value={pagination.pageSize}
            onChange={handlePageSizeChange}
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid var(--border)",
              fontSize: 13
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="panel table-relative" style={{ padding: 0 }}>
        <TableLoader active={loading} />
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Event</th>
                <th>At</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 30, color: "var(--muted)" }}>
                    No activity recorded yet.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td>{r.username}</td>
                  <td>
                    <span className={`role-badge ${r.role}`}>{r.role}</span>
                  </td>
                  <td style={{ textTransform: "capitalize", color: r.event === "login" ? "#3F6B42" : "var(--muted)" }}>
                    {r.event}
                  </td>
                  <td style={{ fontFamily: "var(--mono-font)", fontSize: 12.5 }}>
                    {fmtDateTime(r.at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderTop: "1px solid var(--border)",
              flexWrap: "wrap",
              gap: "8px"
            }}
          >
            <div style={{ fontSize: 13, color: "var(--muted)" }}>
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{" "}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
              {pagination.total} entries
            </div>
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <button
                onClick={() => handlePageChange(1)}
                disabled={pagination.page === 1}
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  cursor: pagination.page === 1 ? "not-allowed" : "pointer",
                  opacity: pagination.page === 1 ? 0.5 : 1,
                  fontSize: 13
                }}
              >
                «
              </button>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  cursor: pagination.page === 1 ? "not-allowed" : "pointer",
                  opacity: pagination.page === 1 ? 0.5 : 1,
                  fontSize: 13
                }}
              >
                ‹
              </button>

              <span style={{ padding: "0 12px", fontSize: 14, fontWeight: 500 }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  cursor: pagination.page === pagination.totalPages ? "not-allowed" : "pointer",
                  opacity: pagination.page === pagination.totalPages ? 0.5 : 1,
                  fontSize: 13
                }}
              >
                ›
              </button>
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  cursor: pagination.page === pagination.totalPages ? "not-allowed" : "pointer",
                  opacity: pagination.page === pagination.totalPages ? 0.5 : 1,
                  fontSize: 13
                }}
              >
                »
              </button>

              {/* Optional: Go to specific page */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "8px" }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>Go to:</span>
                <input
                  type="number"
                  min={1}
                  max={pagination.totalPages}
                  defaultValue={pagination.page}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const val = parseInt(e.target.value, 10);
                      if (val >= 1 && val <= pagination.totalPages) {
                        handlePageChange(val);
                      }
                    }
                  }}
                  style={{
                    width: 50,
                    padding: "2px 4px",
                    borderRadius: 4,
                    border: "1px solid var(--border)",
                    fontSize: 13,
                    textAlign: "center"
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}