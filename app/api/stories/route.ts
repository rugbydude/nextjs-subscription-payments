// app/api/stories/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { data, error } = await supabase
      .from("stories")
      .insert([{ ...body, user_id: session.user.id }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error creating story:", error)
    return NextResponse.json(
      { error: error.message },
      { status: error?.status || 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", session.user.id)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error fetching stories:", error)
    return NextResponse.json(
      { error: error.message },
      { status: error?.status || 500 }
    )
  }
}
