import React from "react";

export default function TableLoader({ active }) {
  if (!active) return null;
  return (
    <div className="table-loader-overlay">
      <div className="table-loader-spinner" />
    </div>
  );
}
