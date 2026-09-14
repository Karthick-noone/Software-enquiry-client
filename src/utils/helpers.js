export function fmtDate(iso) {
  if (!iso) return "\u2014";
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtDateTime(iso) {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { 
    day: "2-digit", 
    month: "short", 
    year: "numeric", 
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

export function fmtTime(timeStr) {
  if (!timeStr) return "\u2014";
  const d = new Date(`2000-01-01T${timeStr}`);
  return d.toLocaleTimeString("en-US", { 
    hour: "numeric", 
    minute: "2-digit",
    hour12: true 
  });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function displayBusinessType(entry) {
  if (entry.business_type === "Other" && entry.custom_business_type) return entry.custom_business_type;
  return entry.business_type;
}