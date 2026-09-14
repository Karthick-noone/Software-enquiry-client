import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch, getToken, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await apiFetch("/auth/me", { onUnauthorized: () => setUser(null) });
        setUser(user);
      } catch (e) {
        setToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (username, password) => {
    const { token, user } = await apiFetch("/auth/login", { method: "POST", body: { username, password } });
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    // Best-effort activity log entry; don't block on it.
    apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    setToken(null);
    setUser(null);
  }, []);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    const res = await apiFetch("/auth/change-password", { method: "POST", body: { oldPassword, newPassword } });
    // Password change invalidates the current token server-side; log out
    // locally too so the person re-authenticates with the new password.
    setToken(null);
    setUser(null);
    return res;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
