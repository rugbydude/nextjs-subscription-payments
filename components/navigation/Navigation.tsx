"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState(null)
  const [tokenBalance, setTokenBalance] = useState(0)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)

      // Fetch token balance
      if (session?.user) {
        const { data } = await supabase
          .from("token_balances")
          .select("balance")
          .eq("user_id", session.user.id)
          .single()
        setTokenBalance(data?.balance || 0)
      }
    }
    checkUser()
  }, [supabase])

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "Home" },
    { 
      label: "Projects",
      icon: "Folder",
      children: [
        { href: "/dashboard/projects", label: "View All" },
        { href: "/dashboard/projects/new", label: "Create New" }
      ]
    },
    {
      label: "User Stories",
      icon: "Book",
      children: [
        { href: "/dashboard/stories", label: "View All" },
        { href: "/dashboard/stories/new", label: "Create New" },
        { href: "/dashboard/stories/ai", label: "AI Generate" }
      ]
    },
    {
      label: "Tasks",
      icon: "CheckSquare",
      children: [
        { href: "/dashboard/tasks", label: "View All" },
        { href: "/dashboard/tasks/new", label: "Create New" }
      ]
    },
    { href: "/dashboard/tokens", label: "Tokens", icon: "Coin" }
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/signin")
  }

  return (
    <nav className="w-64 bg-gray-800 text-white h-screen p-6">
      <div className="space-y-6">
        {user && (
          <div className="pb-4 border-b border-gray-700">
            <p className="text-sm text-gray-400">Token Balance</p>
            <p className="text-xl font-bold">{tokenBalance}</p>
          </div>
        )}

        {navItems.map((item) => (
          <div key={item.label} className="space-y-2">
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
              <>
                <p className="text-gray-400 text-sm px-4">{item.label}</p>
                <div className="pl-4 space-y-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block py-2 px-4 rounded ${
                        pathname === child.href ? "bg-gray-700" : "hover:bg-gray-700"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </>
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
