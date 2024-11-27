// app/api/epics/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const supabase = createRouteHandlerClient({ cookies })
        
        const { data, error } = await supabase
            .from("epics")
            .select("*")
        
        if (error) throw error
        
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch epics" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies })
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { data, error } = await supabase
            .from("epics")
            .insert([{ ...body, user_id: session.user.id }])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create epic" },
            { status: 500 }
        )
    }
}
