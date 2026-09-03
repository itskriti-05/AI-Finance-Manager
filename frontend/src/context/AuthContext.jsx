import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../api/auth.api";
import { tokenStorage } from "../storage/token";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (!tokenStorage.exists()) {
      setLoading(false);
      return;
    }

    authAPI
      .me()
      .then((data) => setUser(data.user))
      .catch(() => tokenStorage.remove())
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await authAPI.login({ email, password });
    tokenStorage.set(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const data = await authAPI.register({ name, email, password });
    tokenStorage.set(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    tokenStorage.remove();
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}