import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || (adminOnly && !user.isAdmin)) {
      router.push("/admin/login");
    }
  }, [user]);

  return user ? children : null;
}
