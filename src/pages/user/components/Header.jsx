import React, { useState } from "react";
import { Plus, NotebookPen, LogOut, KeyRound, Headset } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import UserChangePasswordModal from "./UserChangePasswordModal.jsx";

export default function Header({ onNew }) {
  const { user, logout } = useAuth();
  const [pwOpen, setPwOpen] = useState(false);

  return (
    <header className="ledger-header">
      <div className="brand">
        <span className="brand-mark">
          <Headset size={20} strokeWidth={1.75} />
        </span>
        <div>
          <h1>Software Enquiry</h1>
          <p>Call tracking for web, billing, SEO &amp; invoicing work 
            {/* ● User Panel */}
            </p>
        </div>
      </div>
      <div className="header-actions">
        <button className="btn-primary" onClick={onNew}>
          <Plus size={17} strokeWidth={2} />
          New entry
        </button>
        <div className="user-chip">
          <span className="user-chip-name">{user?.name}</span>
          <button aria-label="Change password" onClick={() => setPwOpen(true)} className="icon-btn">
            <KeyRound size={15} strokeWidth={1.8} />
          </button>
          <button aria-label="Log out" onClick={logout} className="icon-btn">
            <LogOut size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
      {pwOpen && <UserChangePasswordModal onClose={() => setPwOpen(false)} />}
    </header>
  );
}
