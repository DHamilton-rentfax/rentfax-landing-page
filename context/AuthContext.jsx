// context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate user on initial load
  useEffect(() => {
    async function fetchUser() {
      try {
        const { user } = await api.get("/api/auth/me");
        setUser(user);
      } catch (err) {
        console.error("Auth rehydrate error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Login with credentials
  const login = async (email, password) => {
    try {
      const { user: loggedInUser } = await api.post("/api/auth/login", { email, password });
      setUser(loggedInUser);
      toast.success("Logged in successfully");
      router.replace("/admin/blogs");
      return true;
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed");
      return false;
    }
  };

  // Logout and clear session
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      toast.success("Logged out");
      router.replace("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
