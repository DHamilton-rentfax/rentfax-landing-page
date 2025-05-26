import { useState } from "react"
import Link from "next/link"
import { Bars3Icon } from "@heroicons/react/24/outline"

export default function Navbar({ onHamburger, onSearch }) {
  const [q, setQ] = useState("")

  const handleSearch = (e) => {
    const v = e.target.value
    setQ(v)
    onSearch?.(v)
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
        {/* Always‐visible hamburger */}
        <button
          onClick={onHamburger}
          className="p-2 rounded hover:bg-gray-200"
        >
          <Bars3Icon className="h-6 w-6 text-gray-700" />
        </button>

        <Link
          href="/"
          className="text-2xl font-bold text-indigo-600 hover:text-indigo-700"
        >
          RentFAX
        </Link>

        <input
          type="text"
          placeholder="Search…"
          value={q}
          onChange={handleSearch}
          className="flex-1 px-4 py-2 border rounded-md hidden sm:block focus:ring-indigo-500"
        />

        <nav className="flex gap-4 text-sm ml-auto">
          <Link
            href="/blogs"
            className="px-3 py-2 text-gray-700 hover:underline"
          >
            Blog
          </Link>
          <Link
            href="/admin/login"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
