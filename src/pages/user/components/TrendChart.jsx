import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { STATUS_COLORS } from "../../../data/constants";

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
            <Tooltip contentStyle={{ fontSize: 13, border: "1px solid rgba(22,38,43,0.15)", borderRadius: 4 }} />
            <Bar dataKey="Accepted" stackId="s" fill={STATUS_COLORS.Accepted.fg} />
            <Bar dataKey="In Progress" stackId="s" fill={STATUS_COLORS["In Progress"].fg} />
            <Bar dataKey="Hold" stackId="s" fill={STATUS_COLORS.Hold.fg} />
            <Bar dataKey="Delivered" stackId="s" fill={STATUS_COLORS.Delivered.fg} />
            <Bar dataKey="Rejected" stackId="s" fill={STATUS_COLORS.Rejected.fg} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
