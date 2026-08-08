import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authAPI } from "../api/auth.api";
import { tokenStorage } from "../storage/token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenStorage.get();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authAPI.me();
        setUser(data.user);
      } catch (error) {
        console.error("Authentication restore failed:", error);

        tokenStorage.remove();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);

      tokenStorage.set(data.token);
      setUser(data.user);

      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);

      tokenStorage.set(data.token);
      setUser(data.user);

      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    tokenStorage.remove();
    setUser(null);

    window.location.replace("/login");
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}