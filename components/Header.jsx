import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-indigo-600">RentFAX</span>
        </Link>
        <nav className="space-x-6">
          <Link href="/blogs"><span className="hover:underline">Blog</span></Link>
          <Link href="/admin/login"><span className="hover:underline">Admin Login</span></Link>
        </nav>
      </div>
    </header>
  );
}
