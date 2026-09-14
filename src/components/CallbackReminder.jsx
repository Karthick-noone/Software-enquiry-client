import React, { useEffect, useState, useCallback } from "react";
import { PhoneCall, X } from "lucide-react";
import { apiFetch } from "../api/client";
import { fmtDate } from "../utils/helpers";

const SEEN_KEY = "agency-crm:seen-callbacks";

function loadSeen() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"));
  } catch (e) {
    return new Set();
  }
}

function saveSeen(set) {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...set]));
}

export default function CallbackReminder({ refreshKey }) {
  const [queue, setQueue] = useState([]);

  const poll = useCallback(async () => {
    try {
      const due = await apiFetch("/entries/due-callbacks");
      const seen = loadSeen();
      const fresh = due.filter((c) => !seen.has(`${c.id}:${c.updated_at}`));
      if (fresh.length) {
        setQueue((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          return [...prev, ...fresh.filter((c) => !ids.has(c.id))];
        });
      }
    } catch (e) {
      // silent - reminders are best-effort
    }
  }, []);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [poll, refreshKey]);

  function dismiss(entry) {
    const seen = loadSeen();
    seen.add(`${entry.id}:${entry.updated_at}`);
    saveSeen(seen);
    setQueue((prev) => prev.filter((c) => c.id !== entry.id));
  }

  if (queue.length === 0) return null;
  const current = queue[0];

  return (
    <div className="reminder-backdrop">
      <div className="reminder-box">
        <div className="reminder-icon">
          <PhoneCall size={20} strokeWidth={2} />
        </div>
        <h3>Callback due</h3>
        <p>
          Time to call <strong>{current.name}</strong> ({current.phone}).
        </p>
        <p className="reminder-time">
          Scheduled for {fmtDate(current.callback_date)} at {current.callback_time}
        </p>
        <div className="reminder-actions">
          <button onClick={() => dismiss(current)}>
            <X size={15} /> Dismiss
          </button>
        </div>
        {queue.length > 1 && <p className="reminder-more">+{queue.length - 1} more callback(s) due</p>}
      </div>
    </div>
  );
}
