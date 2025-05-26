// components/Layout.jsx
import { useState } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex">
      {/* only render the sliding sidebar when open */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* main content flows here */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200
          ${sidebarOpen ? "md:ml-60" : "md:ml-0"}`}
      >
        {/* the Navbar needs the hamburger callback */}
        <Navbar onHamburger={() => setSidebarOpen((v) => !v)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
