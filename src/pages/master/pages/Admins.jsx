import React from "react";
import AccountsPage from "../../../components/AccountsPage.jsx";

export default function Admins() {
  return <AccountsPage role="admin" title="Admins" addLabel="Add admin" />;
}
