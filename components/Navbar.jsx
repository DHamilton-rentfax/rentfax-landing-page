import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onHamburger }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    if (e.key === "Enter" && q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
      <div className="w-full px-6 py-4 flex items-center gap-6">
        {/* Hamburger */}
        <button onClick={onHamburger} className="p-2 rounded hover:bg-gray-200">
          <Bars3Icon className="h-6 w-6 text-gray-700" />
        </button>

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
          RentFAX
        </Link>

        {/* Search */}
        <input
          type="text"
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleSearch}
          className="flex-1 px-4 py-2 border rounded-md hidden sm:block focus:ring-indigo-500"
        />

        {/* Nav */}
        <nav className="flex gap-3 text-sm ml-auto">
          <Link href="/blogs" className="px-3 py-2 text-gray-700 hover:underline">
            Blog
          </Link>

          {user ? (
            <>
              <button
                onClick={() => router.push("/admin")}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Editor Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
