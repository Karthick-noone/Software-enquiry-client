import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { STATUSES, STATUS_COLORS } from "../data/constants";

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const entries = payload.filter((item) => item.value > 0);
  const total = payload.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

  return (
    <div className="trend-tooltip-card">
      <strong>{label}</strong>
      {entries.map((item) => (
        <div className="trend-tooltip-row" key={item.dataKey}>
          <span className="trend-tooltip-status">
            <span className="trend-tooltip-dot" style={{ background: item.color }} />
            {item.dataKey}
          </span>
          <strong>{item.value}</strong>
        </div>
      ))}
      <div className="trend-tooltip-total">
        <span>Total entries</span>
        <strong>{total}</strong>
      </div>
    </div>
  );
}

export default function PremiumTrendChart({ trendData, trendRange, setTrendRange }) {
  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ margin: 0 }}>Call activity</h3>
        <div className="range-toggle" style={{ borderColor: "var(--rule)" }}>
          <button className={trendRange === "week" ? "active" : ""} onClick={() => setTrendRange("week")}>
            Week
          </button>
          <button className={trendRange === "month" ? "active" : ""} onClick={() => setTrendRange("month")}>
            Month
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={trendData} barCategoryGap={trendRange === "week" ? "28%" : "18%"}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={{ stroke: "var(--chart-axis)" }} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} width={26} />
          <Tooltip content={<TrendTooltip />} />
          {STATUSES.map((status, index) => (
            <Bar
              key={status}
              dataKey={status}
              stackId="s"
              fill={STATUS_COLORS[status].fg}
              radius={index === STATUSES.length - 1 ? [3, 3, 0, 0] : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
