"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface User {
  id: string
  email?: string
}

interface NavItem {
  href?: string
  label: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  {
    label: "Projects",
    children: [
      { href: "/dashboard/projects", label: "View All" },
      { href: "/dashboard/projects/new", label: "Create New" }
    ]
  },
  {
    label: "Epics",
    children: [
      { href: "/dashboard/epics", label: "View All" },
      { href: "/dashboard/epics/new", label: "Create New" }
    ]
  },
  {
    label: "Stories",
    children: [
      { href: "/dashboard/stories", label: "View All" },
      { href: "/dashboard/stories/new", label: "Create New" }
    ]
  }
]

function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getUser()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/signin")
  }

  return (
    <nav className="w-64 bg-gray-800 text-white h-screen p-6">
      <div className="space-y-6">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className={`block py-2 px-4 rounded ${
                  pathname === item.href ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <div>
                <p className="text-sm text-gray-400 px-4 mb-2">{item.label}</p>
                <div className="space-y-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href || ""}
                      className={`block py-2 px-4 rounded ${
                        pathname === child.href ? "bg-gray-700" : "hover:bg-gray-700"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {user && (
          <button
            onClick={handleSignOut}
            className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 text-red-400"
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navigation
