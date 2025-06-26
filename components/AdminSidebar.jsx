import Link from "next/link";
import { useRouter } from "next/router";
import {
  ViewColumnsIcon,   // Dashboard
  PencilSquareIcon,  // Manage Posts
  UsersIcon,         // Approve Editors
  ChartBarIcon,      // Analytics
  BellAlertIcon,     // Alerts
  DocumentIcon,      // Risk Reports
  ChatBubbleBottomCenterTextIcon, // Comments
  XMarkIcon,
} from "@heroicons/react/24/outline";

const APP_NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: ViewColumnsIcon },
  { href: "/admin/reports", label: "Risk Reports", icon: DocumentIcon },
  { href: "/admin/alerts", label: "Alerts", icon: BellAlertIcon },
];

const WEBSITE_NAV = [
  { href: "/admin/blogs", label: "Manage Posts", icon: PencilSquareIcon },
  { href: "/admin/comments", label: "Moderate Comments", icon: ChatBubbleBottomCenterTextIcon },
  { href: "/admin/users", label: "Approve Editors", icon: UsersIcon },
  { href: "/admin/analytics", label: "Analytics", icon: ChartBarIcon },
];

export default function AdminSidebar({ open, onClose }) {
  const { pathname } = useRouter();

  const renderNavSection = (title, items) => (
    <div className="space-y-2">
      <h4 className="text-xs uppercase font-semibold text-gray-500 mb-1">{title}</h4>
      <ul className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
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
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-lg px-4 py-6 z-50
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-indigo-600">Admin</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-200">
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Application Section */}
        {renderNavSection("Application", APP_NAV)}

        <hr className="my-4" />

        {/* Website Section */}
        {renderNavSection("Website", WEBSITE_NAV)}
      </aside>
    </>
  );
}
