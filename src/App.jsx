import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import PageLoader from "./components/PageLoader.jsx";
import CallbackReminder from "./components/CallbackReminder.jsx";
import Login from "./pages/login/Login.jsx";
import UserApp from "./pages/user/UserApp.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/pages/Dashboard.jsx";
import AdminClients from "./pages/admin/pages/Clients.jsx";
import AdminUsers from "./pages/admin/pages/AddUsers.jsx";
import ChangePassword from "./pages/admin/pages/ChangePassword.jsx";
import MasterLayout from "./pages/master/MasterLayout.jsx";
import MasterAdmins from "./pages/master/pages/Admins.jsx";
import MasterActivityLogs from "./pages/master/pages/ActivityLogs.jsx";

function BodyTheme() {
  const { user } = useAuth();
  useEffect(() => {
    document.body.classList.remove("theme-admin", "theme-master", "light-mode");
    if (user?.role === "admin" || user?.role === "master") {
      document.body.classList.add(`theme-${user.role}`);
      const saved = localStorage.getItem(`agency-crm:theme-mode:${user.role}`);
      if (saved === "light") document.body.classList.add("light-mode");
    }
    return () => document.body.classList.remove("theme-admin", "theme-master", "light-mode");
  }, [user?.role]);
  return null;
}

function RequireRole({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "master") return <Navigate to="/master/dashboard" replace />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return <UserApp />;
}

function GlobalReminder() {
  const { user } = useAuth();
  if (!user) return null;
  return <CallbackReminder />;
}

function ScrollToTopButton() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user) return undefined;

    const scrollContainer = document.querySelector(".shell-content");
    const getScrollTop = () => scrollContainer?.scrollTop ?? window.scrollY;
    const handleScroll = () => setVisible(getScrollTop() > 280);
    const target = scrollContainer || window;
    target.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => target.removeEventListener("scroll", handleScroll);
  }, [user]);

  if (!user || !visible) return null;

  return (
    <button
      type="button"
      className="scroll-top-btn"
      onClick={() => {
        const scrollContainer = document.querySelector(".shell-content");
        if (scrollContainer) {
          scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ArrowUp size={17} strokeWidth={1.9} />
    </button>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BodyTheme />
        <GlobalReminder />
        <ScrollToTopButton />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootRedirect />} />

          <Route
            path="/admin"
            element={
              <RequireRole roles={["admin"]}>
                <AdminLayout />
              </RequireRole>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          <Route
            path="/master"
            element={
              <RequireRole roles={["master"]}>
                <MasterLayout />
              </RequireRole>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="admins" element={<MasterAdmins />} />
            <Route path="activity" element={<MasterActivityLogs />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
