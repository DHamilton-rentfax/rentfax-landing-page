// components/ProtectRoute.jsx
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in → redirect to login
        window.location.href = "/admin/login";
      } else if (adminOnly && !user.roles?.includes("admin")) {
        // Logged in, but not an admin → redirect home
        window.location.href = "/";
      }
    }
  }, [user, loading, adminOnly]);

  // While loading or unauthorized, render nothing
  if (loading || !user || (adminOnly && !user.roles?.includes("admin"))) {
    return null;
  }

  return <>{children}</>;
}
