import React from "react";
import { LayoutDashboard, Users, UserPlus, ShieldCheck, KeyRound, History } from "lucide-react";
import AppShell from "../../components/AppShell.jsx";

const NAV_ITEMS = [
  { to: "/master/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/master/clients", label: "Clients", icon: Users },
  { to: "/master/users", label: "Users", icon: UserPlus },
  { to: "/master/admins", label: "Admins", icon: ShieldCheck },
  { to: "/master/activity", label: "Activity Logs", icon: History },
  { to: "/master/change-password", label: "Change Password", icon: KeyRound },
];

export default function MasterLayout() {
  return (
    <AppShell
      navItems={NAV_ITEMS}
      brandTitle="Software Enquiry"
      brandSubtitle="Master panel"
      pageTitle="Master Panel"
      pageSubtitle="Full oversight across admins, users and clients"
    />
  );
}
