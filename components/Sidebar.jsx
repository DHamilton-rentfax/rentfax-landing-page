// components/Sidebar.jsx
import Link from "next/link"
import { useRouter } from "next/router"
import { XMarkIcon, HomeIcon, BookOpenIcon, InformationCircleIcon, UserIcon } from "@heroicons/react/24/outline"

const NAV_ITEMS = [
  { href: "/",        label: "Home",    icon: HomeIcon },
  { href: "/blogs",   label: "Blog",    icon: BookOpenIcon },
  { href: "/about",   label: "About Us",icon: InformationCircleIcon },
  { href: "/pricing", label: "Pricing", icon: UserIcon /* swap for a pricing icon if you like */ },
  { href: "/login",   label: "Login",   icon: UserIcon },
]

export default function Sidebar({ open, onClose }) {
  const { pathname } = useRouter()

  return (
    <>
      {/* backdrop */}
      <div
        className={`
          fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />

      {/* sliding panel */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r shadow-lg z-50
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-6">
          <h2 className="text-2xl font-bold">Menu</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>
        <ul className="px-2 space-y-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors
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
