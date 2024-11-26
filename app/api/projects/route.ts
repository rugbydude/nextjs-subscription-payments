import { createHandler } from "@/types/api/handler"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const GET = createHandler(async (req, { userId }) => {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)

  if (error) throw error
  return NextResponse.json(data)
})

export const POST = createHandler(async (req, { userId }) => {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await req.json()
  
  const { data, error } = await supabase
    .from("projects")
    .insert([{ ...body, user_id: userId }])
    .select()

  if (error) throw error
  return NextResponse.json(data[0])
})
