import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { STATUSES, STATUS_COLORS } from "../../../data/constants";

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

export default function TrendChart({ trendData, trendRange, setTrendRange, thisWeek, thisMonth }) {
  return (
    <section className="trend-card">
      <div className="trend-head">
        <div>
          <h2>Call activity</h2>
          <p>
            {thisWeek} calls logged this week. {thisMonth} in the last 30 days.
          </p>
        </div>
        <div className="range-toggle">
          <button className={trendRange === "week" ? "active" : ""} onClick={() => setTrendRange("week")}>
            Week
          </button>
          <button className={trendRange === "month" ? "active" : ""} onClick={() => setTrendRange("month")}>
            Month
          </button>
        </div>
      </div>
      <div className="trend-chart">
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={trendData} barCategoryGap={trendRange === "week" ? "28%" : "18%"}>
            <CartesianGrid vertical={false} stroke="rgba(22,38,43,0.1)" />
            <XAxis dataKey="label" tick={{ fill: "#4B5D57", fontSize: 12 }} axisLine={{ stroke: "rgba(22,38,43,0.15)" }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "#4B5D57", fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
            <Tooltip content={<TrendTooltip />} cursor={{ fill: "rgba(22,38,43,0.05)" }} />
            {STATUSES.map((status, index) => (
              <Bar
                key={status}
                dataKey={status}
                stackId="s"
                fill={STATUS_COLORS[status].fg}
                radius={index === STATUSES.length - 1 ? [2, 2, 0, 0] : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
