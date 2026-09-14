import React, { useState, useEffect, useCallback } from "react";
import { Users, Phone, CheckCircle2, Clock } from "lucide-react";
import { apiFetch } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import PremiumTrendChart from "../../../components/PremiumTrendChart.jsx";

export default function Dashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState({ total: 0, byStatus: {}, thisWeek: 0, thisMonth: 0 });
  const [trendData, setTrendData] = useState([]);
  const [trendRange, setTrendRange] = useState("week");

  const load = useCallback(async () => {
    try {
      const s = await apiFetch("/entries/stats", { onUnauthorized: logout });
      setStats(s);
    } catch (e) {
      /* ignore */
    }
  }, [logout]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    (async () => {
      try {
        const t = await apiFetch(`/entries/trend?range=${trendRange}`, { onUnauthorized: logout });
        setTrendData(t);
      } catch (e) {
        /* ignore */
      }
    })();
  }, [trendRange, logout]);

  const cards = [
    { label: "Total clients", value: stats.total, icon: Users },
    { label: "This week", value: stats.thisWeek, icon: Phone },
    { label: "This month", value: stats.thisMonth, icon: Clock },
    { label: "Accepted", value: stats.byStatus?.Accepted || 0, icon: CheckCircle2 },
  ];

  return (
    <div>
      <div className="stat-card-grid">
        {cards.map(({ label, value, icon: Icon }) => (
          <div className="stat-card" key={label}>
            <Icon size={16} strokeWidth={1.8} style={{ color: "var(--brass)", marginBottom: 8 }} />
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="panel-row">
        <PremiumTrendChart trendData={trendData} trendRange={trendRange} setTrendRange={setTrendRange} />
        <div className="panel">
          <h3>Status breakdown</h3>
          {["New", "In Progress", "Accepted", "Hold", "Rejected", "Delivered"].map((s) => (
            <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--rule)", fontSize: 13.5 }}>
              <span style={{ color: "var(--muted)" }}>{s}</span>
              <span style={{ fontFamily: "var(--mono-font)", color: "var(--text)" }}>{stats.byStatus?.[s] || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
