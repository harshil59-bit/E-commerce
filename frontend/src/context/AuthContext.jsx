import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ✅ Hydrate user immediately from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("cartlabs_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ✅ Only show loading if token exists
  const [loading, setLoading] = useState(() => {
    return !!localStorage.getItem("cartlabs_token");
  });

  // ✅ Save session
  const persistSession = (data) => {
    localStorage.setItem("cartlabs_token", data.access_token);
    localStorage.setItem("cartlabs_user", JSON.stringify(data.user));

    setUser(data.user);
    setLoading(false);
  };

  // ✅ Login
  const login = useCallback(async (payload) => {
    const { data } = await api.post("/auth/login", payload);

    persistSession(data);

    return data.user;
  }, []);

  // ✅ Register
  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);

    persistSession(data);

    return data.user;
  }, []);

  // ✅ Logout
  const logout = useCallback(() => {
    localStorage.removeItem("cartlabs_token");
    localStorage.removeItem("cartlabs_user");

    setUser(null);
    setLoading(false);
  }, []);

  // ✅ Validate token on app startup
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("cartlabs_token");

      // No token → stop loading
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token
        const { data } = await api.get("/auth/me");

        localStorage.setItem(
          "cartlabs_user",
          JSON.stringify(data)
        );

        setUser(data);
      } catch (error) {
        console.error("Auth initialization failed:", error);

        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [logout]);

  // ✅ Context value
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}