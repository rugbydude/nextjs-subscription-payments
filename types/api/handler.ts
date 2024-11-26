// types/api/handler.ts
import { NextRequest } from "next/server"

export type ApiHandler = (
  req: NextRequest,
  context: { userId: string }
) => Promise<Response>

export const createHandler = 
  (handler: ApiHandler) => async (req: NextRequest) => {
    try {
      const { error, status, userId } = await validateAuth()
      
      if (error) {
        return NextResponse.json({ error }, { status })
      }

      return await handler(req, { userId })
    } catch (error) {
      console.error("API error:", error)
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }
