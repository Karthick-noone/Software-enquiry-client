import React from "react";
import { ArrowDownUp } from "lucide-react";

export default function SortDropdown({ sort, setSort }) {
  return (
    <label className="sort-dropdown">
      <ArrowDownUp size={14} strokeWidth={1.8} />
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
    </label>
  );
}
