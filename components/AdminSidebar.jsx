// components/AdminSidebar.jsx
import Link from "next/link"
import { useRouter } from "next/router"
import {
  ViewColumnsIcon,    // Dashboard
  PencilSquareIcon,   // Edit posts
  UsersIcon,          // Users
  ChartBarIcon,       // Analytics
  XMarkIcon,          // Close button
} from "@heroicons/react/24/outline"

const NAV_ITEMS = [
  { href: "/admin/analytics", label: "Analytics", icon: ChartBarIcon },
  { href: "/admin/blogs",     label: "Posts",     icon: PencilSquareIcon },
  { href: "/admin/users",     label: "Users",     icon: UsersIcon },
  { href: "/admin/dashboard", label: "Dashboard", icon: ViewColumnsIcon },
]

export default function AdminSidebar({ open, onClose }) {
  const { pathname } = useRouter()

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* sliding panel */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r shadow-lg px-4 py-6 z-50
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Admin</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-200">
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <ul className="space-y-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                    ${active
                      ? "bg-indigo-100 text-indigo-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"}
                  `}
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
