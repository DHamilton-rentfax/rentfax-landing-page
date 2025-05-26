// pages/_app.js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "../context/AuthContext";
// Removed ProtectedRoute import
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // avoid hydration mismatch
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const path = hydrated ? router.asPath : "";
  const isAdminArea = path.startsWith("/admin");

  // off-canvas menu
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((v) => !v);

  return (
    <HelmetProvider>
      <AuthProvider>
        <Navbar onHamburger={toggleMenu} />

        <div className="flex">
          {/* Public sidebar */}
          {!isAdminArea && menuOpen && (
            <div className="fixed inset-0 z-40 flex">
              <div
                className="absolute inset-0 bg-black/25"
                onClick={toggleMenu}
              />
              <div
                className="relative w-60 bg-white shadow-xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar />
              </div>
            </div>
          )}

          {/* Admin sidebar */}
          {isAdminArea && hydrated && <AdminSidebar />}

          {/* Main content */}
          <main className="flex-1 w-full px-0">
            {/* Render every page directly; each /admin page
                should wrap itself in ProtectedRoute if needed */}
            <Component {...pageProps} />
          </main>
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
}
