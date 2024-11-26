import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply to /api/ai/generate endpoint
  if (request.nextUrl.pathname === '/api/ai/generate') {
    // Validate OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Validate that it's a POST request
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/ai/generate'
}
