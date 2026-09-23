import React from "react";
import { STATUSES, STATUS_COLORS } from "../../../data/constants";

export default function StatStrip({ stats }) {
  const cols = [
    ["Total entries", stats.total, null],
    ...STATUSES.map((status) => [status, stats.byStatus[status], status]),
  ];

  return (
    <section className="stat-strip" aria-label="Ledger totals">
      {cols.map(([label, value, statusKey]) => (
        <div className="stat-col" key={label}>
          <span className="stat-num" style={statusKey ? { color: STATUS_COLORS[statusKey].fg } : undefined}>
            {value ?? 0}
          </span>
          <span className="stat-label">{label}</span>
        </div>
      ))}
    </section>
  );
}
