import React from "react";
import { STATUS_COLORS } from "../../../data/constants";

export default function StatStrip({ stats }) {
  const cols = [
    ["Total entries", stats.total, null],
    ["In progress", stats.byStatus["In Progress"], "In Progress"],
    ["Accepted", stats.byStatus.Accepted, "Accepted"],
    ["On hold", stats.byStatus.Hold, "Hold"],
    ["Delivered", stats.byStatus.Delivered, "Delivered"],
    ["Rejected", stats.byStatus.Rejected, "Rejected"],
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
