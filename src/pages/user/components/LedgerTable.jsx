import React from "react";
import { Pencil, Trash2, Phone, Mail, PhoneCall, Plus, EyeIcon, MapPin, Headset } from "lucide-react";
import StatusBadge from "../../../components/StatusBadge";
import { fmtDate, fmtTime, displayBusinessType } from "../../../utils/helpers";


export default function LedgerTable({ rows, page, pageSize, totalCount, onEdit, onDelete, onNew }) {
  if (rows.length === 0) {
    return (
      <section className="ledger-table-wrap">
        <div className="empty-state">
          <p>
            {totalCount === 0
              ? "No entries yet. Log your first call to start the ledger."
              : "No entries match these filters."}
          </p>
          {totalCount === 0 && (
            <button className="btn-primary" onClick={onNew}>
              <Plus size={16} />
              Log a call
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="ledger-table-wrap">
      <div className="table-scroll">
        <table className="ledger-table">
          <thead>
            <tr>
              <th className="num-col">#</th>
              <th>Customer</th>
              <th>Contact Person</th>
              <th>Notes</th>
              {/* <th>Location</th> */}
              {/* <th>Business need</th> */}
              <th>Status</th>
              {/* <th>Duration</th> */}
              <th>Call date</th>
              <th>Callback</th>
              <th>Added By</th>
              <th aria-label="Actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c, idx) => (
              <tr key={c.id}>
                <td className="num-col mono">{String((page - 1) * pageSize + idx + 1).padStart(2, "0")}</td>
                <td>
                  <div className="cell-name">{c.name}</div>

                  {/* <td>
                    {c.contactPerson && (
                      <div className="cell-contact">
                        <span>
                          <User size={12} strokeWidth={1.75} /> {c.contactPerson}
                        </span>
                      </div>
                    )}
                  </td> */}
                  <div className="cell-contact">
                    <span>
                      <Phone size={12} strokeWidth={1.75} /> {c.phone}
                      {c.secondary_phones && c.secondary_phones.length > 0 && ` +${c.secondary_phones.length}`}
                    </span>
                    {c.email && (
                      <span>
                        <Mail size={12} strokeWidth={1.75} /> {c.email}
                      </span>
                    )}
                    {c.location && (
                      <span>
                        <MapPin size={12} strokeWidth={1.75} /> {c.location}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  {c.contactPerson ? (
                    <div className="cell-contact">
                      <span>
                        <Headset size={12} strokeWidth={1.75} />
                        {c.contactPerson}
                      </span>
                    </div>
                  ) : "-"}
                </td>

                <td>
                  {c.notes ? (
                    <div className="cell-contact">
                      <span>

                        {c.notes}
                      </span>
                    </div>
                  ) : "-"}
                </td>

                {/* <td>   {c.location && (
                  <div className="cell-contact">
                    <span>
                      <MapPin size={12} strokeWidth={1.75} /> {c.location}
                    </span>
                  </div>
                )}
                </td> */}
                {/* <td>{displayBusinessType(c)}</td> */}
                <td>
                  <StatusBadge status={c.status} />
                </td>
                {/* <td className="mono">{c.status === "Accepted" || c.status === "Delivered" ? c.duration || "\u2014" : "\u2014"}</td> */}
                <td className="mono">{fmtDate(c.call_date)}</td>
                <td>
                  {c.callback_date ? (
                    <span className="callback-pill">
                      <PhoneCall size={11} strokeWidth={1.9} />
                      {fmtDate(c.callback_date)} {fmtTime(c.callback_time)}
                    </span>
                  ) : (
                    "\u2014"
                  )}
                </td>
                <td className="cell-whoAdded">{c.created_by_name}</td>

                <td>
                  <div className="row-actions">
                    <button aria-label="Edit entry" onClick={() => onEdit(c)}>
                      <EyeIcon size={15} strokeWidth={1.75} />
                    </button>
                    <button aria-label="Delete entry" onClick={() => onDelete(c)}>
                      <Trash2 size={15} strokeWidth={1.75} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
