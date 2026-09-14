import React from "react";
import { BUSINESS_TYPES } from "../data/constants";

export default function BusinessTypeField({ value, customValue, onChange, onCustomChange, className }) {
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <select className={className} value={value} onChange={(e) => onChange(e.target.value)}>
        {BUSINESS_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      {value === "Other" && (
        <input
          className={className}
          style={{ marginTop: 8 }}
          type="text"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Describe the business need"
        />
      )}
    </div>
  );
}
