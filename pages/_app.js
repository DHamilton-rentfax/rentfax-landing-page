import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "../context/AuthContext";
import { SpeedInsights } from "@vercel/speed-insights/next"; // ✅ NEW

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setHydrated(true), []);
  const path = hydrated ? router.asPath : "";
  const isAdminArea = path.startsWith("/admin");

  return (
    <HelmetProvider>
      <AuthProvider>
        <div className="min-h-screen w-full flex flex-col bg-white text-gray-800 overflow-x-hidden">
          <Navbar onHamburger={() => setMenuOpen(prev => !prev)} />

          <div className="flex flex-1 pt-16 w-full">
            {/* Public Sidebar - Mobile Off-Canvas */}
            {!isAdminArea && menuOpen && (
              <div className="fixed inset-0 z-40 flex">
                <div
                  className="absolute inset-0 bg-black/25"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  className="relative w-64 bg-white shadow-lg p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Sidebar />
                </div>
              </div>
            )}

            {/* Admin Sidebar - Toggleable */}
            {isAdminArea && hydrated && (
              <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
            )}

            {/* Main Content */}
            <main className="flex-1 w-full px-0">
              <Component {...pageProps} />
            </main>
          </div>

          {/* ✅ Vercel Speed Insights */}
          <SpeedInsights />
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
}
