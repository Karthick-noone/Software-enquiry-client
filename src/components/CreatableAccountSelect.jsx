import React from "react";
import CreatableSelect from "react-select/creatable";

export default function CreatableAccountSelect({ value, options, onChange }) {
  const selectOptions = (options || []).map((name) => ({ value: name, label: name }));
  const selectedOption = value ? { value, label: value } : null;

  return (
    <CreatableSelect
  isClearable
  options={selectOptions}
  value={selectedOption}
  onChange={(option) => onChange(option?.value || "")}
  onCreateOption={(name) => onChange(name.trim())}
  formatCreateLabel={(name) => `Create "${name}"`}
  classNamePrefix="contact-person-select"
  menuPortalTarget={document.body}
  styles={{
    control: (base, state) => ({
      ...base,
      minHeight: 36,
      height: 36,
      borderColor: state.isFocused ? "var(--brass)" : "var(--rule)",
      borderRadius: 4,
      backgroundColor: "var(--paper)",
      boxShadow: state.isFocused ? "0 0 0 1px var(--brass)" : "none",
      "&:hover": { borderColor: state.isFocused ? "var(--brass)" : "var(--rule)" },
    }),
    valueContainer: (base) => ({ ...base, padding: "0 8px", height: 36 }),
    indicatorsContainer: (base) => ({ ...base, height: 36 }),
    input: (base) => ({ ...base, color: "var(--text)", fontFamily: "var(--body-font)", fontSize: 13, margin: 0, padding: 0 }),
    singleValue: (base) => ({ ...base, color: "var(--text)", fontFamily: "var(--body-font)", fontSize: 12.5 }),
    placeholder: (base) => ({ ...base, color: "var(--muted)", fontFamily: "var(--body-font)", fontSize: 12.5 }),
    menuPortal: (base) => ({ ...base, zIndex: 10000 }),
    menu: (base) => ({ ...base, backgroundColor: "var(--paper)", color: "var(--text)" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "var(--paper-2)" : "var(--paper)",
      color: "var(--text)",
      fontFamily: "var(--body-font)",
      fontSize: 12.5,
      padding: "4px 8px",
    }),
    dropdownIndicator: (base) => ({ ...base, padding: 4 }),
    clearIndicator: (base) => ({ ...base, padding: 4 }),
  }}
/>
  );
}