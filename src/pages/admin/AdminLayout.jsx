import React from "react";
import { LayoutDashboard, Users, UserPlus, KeyRound } from "lucide-react";
import AppShell from "../../components/AppShell.jsx";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/users", label: "Add Users", icon: UserPlus },
  { to: "/admin/change-password", label: "Change Password", icon: KeyRound },
];

export default function AdminLayout() {
  return (
    <AppShell
      navItems={NAV_ITEMS}
      brandTitle="Software Enquiry"
      brandSubtitle="Admin panel"
      pageTitle="Admin Panel"
      pageSubtitle="Manage clients, callers and your account"
    />
  );
}
