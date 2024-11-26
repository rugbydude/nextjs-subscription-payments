"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { ReactNode } from "react"
import Navigation from "@/components/navigation/Navigation"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/signin")
      }
    }
    checkUser()
  }, [router, supabase.auth])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
