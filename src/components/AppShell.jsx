import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X, LogOut, Orbit, Sun, Moon, Headset } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ navItems, brandTitle, brandSubtitle, pageTitle, pageSubtitle }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(() => localStorage.getItem(`agency-crm:theme-mode:${user?.role}`) === "light");

  useEffect(() => {
    document.body.classList.toggle("light-mode", light);
    if (user?.role) localStorage.setItem(`agency-crm:theme-mode:${user.role}`, light ? "light" : "dark");
  }, [light, user?.role]);

  return (
    <div className="shell">
      <aside className={`shell-sidebar ${open ? "open" : ""}`}>
        <div className="shell-brand">
          <span className="shell-brand-mark">
            <Headset size={17} strokeWidth={2} />
          </span>
          <div>
            <h1>{brandTitle}</h1>
            <p>{brandSubtitle}</p>
          </div>
        </div>
        <nav className="shell-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Icon size={17} strokeWidth={1.9} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="shell-sidebar-foot">Software Enquiry &middot; {user?.role}</div>
      </aside>

      <div className="shell-main">
        <header className="shell-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="shell-menu-btn" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h2>{pageTitle}</h2>
              {pageSubtitle && <p className="shell-topbar-sub">{pageSubtitle}</p>}
            </div>
          </div>
          <div className="shell-user">
            <button className="theme-toggle-btn" onClick={() => setLight((v) => !v)} aria-label="Toggle light/dark theme">
              {light ? <Moon size={16} strokeWidth={1.8} /> : <Sun size={16} strokeWidth={1.8} />}
            </button>
            <span className="shell-role-pill">{user?.role}</span>
            <span className="shell-user-name">{user?.name}</span>
            <button className="shell-logout" onClick={logout} aria-label="Log out">
              <LogOut size={16} strokeWidth={1.8} />
            </button>
          </div>
        </header>
        <main className="shell-content">
          <Outlet context={{ pageTitle }} />
        </main>
      </div>
    </div>
  );
}
