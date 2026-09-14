import React from "react";
import { 
  UserPlus, Loader2, CheckCircle2, PauseCircle, 
  XCircle, CheckCircle, PhoneOff, AlertCircle 
} from "lucide-react";
import { STATUS_COLORS } from "../data/constants";

const STATUS_ICONS = {
  "New": UserPlus,
  "In Progress": Loader2,
  "Accepted": CheckCircle2,
  "Hold": PauseCircle,
  "Rejected": XCircle,
  "Delivered": CheckCircle,
  "Not Answered": PhoneOff,
  "Wrong Number": AlertCircle,
};

export default function StatusBadge({ status, showIcon = true }) {
  const style = STATUS_COLORS[status] || STATUS_COLORS.New;
  const Icon = STATUS_ICONS[status];

  return (
    <span className="stamp" style={{ color: style.fg, background: style.bg }}>
      {showIcon && Icon && <Icon size={12} strokeWidth={2} />}
      {status}
    </span>
  );
}