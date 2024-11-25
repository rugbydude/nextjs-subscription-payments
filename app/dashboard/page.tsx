"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Navigation from "@/components/navigation/Navigation"

export default function Dashboard() {
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
    <div className="flex h-screen">
      <Navigation />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {/* Add dashboard content here */}
      </main>
    </div>
  )
}
