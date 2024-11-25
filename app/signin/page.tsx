"use client"

import { useRouter } from "next/navigation"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SignIn() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth event:", event)
    console.log("Session:", session)
    
    if (session) {
      router.push("/dashboard")
    }
  })

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={["github"]}
      redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
    />
  )
}
