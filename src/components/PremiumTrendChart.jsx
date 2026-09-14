import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { STATUS_COLORS } from "../data/constants";

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
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} width={26} />
          <Tooltip
            contentStyle={{
              fontSize: 13,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              background: "#1c1f27",
              color: "#e7e9ee",
            }}
          />
          <Bar dataKey="Accepted" stackId="s" fill={STATUS_COLORS.Accepted.fg} />
          <Bar dataKey="In Progress" stackId="s" fill={STATUS_COLORS["In Progress"].fg} />
          <Bar dataKey="Hold" stackId="s" fill={STATUS_COLORS.Hold.fg} />
          <Bar dataKey="Delivered" stackId="s" fill={STATUS_COLORS.Delivered.fg} />
          <Bar dataKey="Rejected" stackId="s" fill={STATUS_COLORS.Rejected.fg} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
