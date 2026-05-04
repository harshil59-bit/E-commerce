import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cartlabs_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("cartlabs_token")));

  const persistSession = (data) => {
    localStorage.setItem("cartlabs_token", data.access_token);
    localStorage.setItem("cartlabs_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = useCallback(async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    persistSession(data);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cartlabs_token");
    localStorage.removeItem("cartlabs_user");
    setUser(null);
  }, []);

  useEffect(() => {
    const refreshUser = async () => {
      if (!localStorage.getItem("cartlabs_token")) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        localStorage.setItem("cartlabs_user", JSON.stringify(data));
        setUser(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    refreshUser();
  }, [logout]);

  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
