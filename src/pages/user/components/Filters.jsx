import React from "react";
import { Search, X } from "lucide-react";
import { BUSINESS_TYPES, STATUSES, STATUS_COLORS } from "../../../data/constants";
import SortDropdown from "../../../components/SortDropdown";

export default function Filters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  contactPersonFilter,
  setContactPersonFilter,
  contactPersons,
  addedByFilter,
  setAddedByFilter,
  addedByNames,
  sort,
  setSort,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onClearAll,
}) {
  const clearDates = () => {
    setDateFrom("");
    setDateTo("");
  };

  const hasDates = dateFrom || dateTo;
  const hasActiveFilters = Boolean(
    search ||
    typeFilter !== "All" ||
    statusFilter !== "All" ||
    contactPersonFilter !== "All" ||
    addedByFilter !== "All" ||
    sort !== "newest" ||
    hasDates
  );

  return (
    <section className="filters-row">
      <div className="search-field">
        <Search size={16} strokeWidth={1.75} />
        <input
          type="text"
          placeholder="Search name, phone or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search &&(
        <X style={{cursor: "pointer"}} size={16} strokeWidth={1.75} onClick={() => setSearch("")} />
        )}
      </div>

      <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
        <option value="All">All business types</option>
        {BUSINESS_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select value={contactPersonFilter} onChange={(e) => setContactPersonFilter(e.target.value)}>
        <option value="All">All contact persons</option>
        {contactPersons.map((person) => (
          <option key={person} value={person}>
            {person}
          </option>
        ))}
      </select>

      <select value={addedByFilter} onChange={(e) => setAddedByFilter(e.target.value)}>
        <option value="All">All added by</option>
        {addedByNames.map((name) => <option key={name} value={name}>{name}</option>)}
      </select>

      <SortDropdown sort={sort} setSort={setSort} />

      {/* Date Range Filters */}
   
      <div className="chip-row">
        <button
          className={statusFilter === "All" ? "chip active" : "chip"}
          onClick={() => setStatusFilter("All")}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            className={statusFilter === s ? "chip active" : "chip"}
            style={
              statusFilter === s
                ? { borderColor: STATUS_COLORS[s].fg, color: STATUS_COLORS[s].fg }
                : {}
            }
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </button>
        ))}

           <div className="date-filters">
        <div className="date-input-group">
          <label>From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            max={dateTo || undefined}
            className="date-input"
          />
        </div>
        <div className="date-input-group">
          <label>To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            min={dateFrom || undefined}
            className="date-input"
          />
        </div>
        {hasDates && (
          <button className="clear-dates-btn" onClick={clearDates} title="Clear dates">
            <X size={16} />
          </button>
        )}
      </div>
    {onClearAll && hasActiveFilters && (
        <button type="button" className="clear-filters-btn" onClick={onClearAll} title="Clear all filters">
          <X size={15} />
          Clear filters
        </button>
      )}
      </div>

  
    </section>
  );
}