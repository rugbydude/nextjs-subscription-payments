"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/signin")
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/projects", label: "Projects" },
    { href: "/dashboard/documents", label: "Documents" },
    { href: "/dashboard/tasks", label: "Tasks" }
  ]

  return (
    <nav className="w-64 bg-gray-800 text-white p-6">
      <div className="space-y-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block py-2 px-4 rounded ${
              pathname === item.href ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleSignOut}
          className="w-full text-left py-2 px-4 rounded hover:bg-gray-700"
        >
          Sign Out
        </button>
      </div>
    </nav>
  )
}
