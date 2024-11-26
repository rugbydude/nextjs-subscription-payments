import OpenAI from "openai"
import { NextResponse } from "next/server"
import type { AIRequest } from "@/types"
import { OPENAI_API_KEY } from "@/lib/config"

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
})

const generatePrompts: Record<AIRequest["type"], (count: number) => string> = {
  story: (count: number) => `Generate ${count} user stor${count > 1 ? 'ies' : 'y'} in JSON format with the following fields:
    - title: A clear, concise title
    - description: A detailed description of what needs to be done
    - acceptance_criteria: A list of specific criteria that must be met for the story to be considered complete
    
    Format the response as a JSON array of objects, each with these fields.
    Example: [{"title": "...", "description": "...", "acceptance_criteria": "..."}]`,
  
  epic: (count: number) => `Generate ${count} epic${count > 1 ? 's' : ''} in JSON format with the following fields:
    - title: A clear, concise title
    - description: A high-level description of the epic's goal and scope
    
    Format the response as a JSON array of objects, each with these fields.
    Example: [{"title": "...", "description": "..."}]`,
  
  task: (count: number) => `Generate ${count} task${count > 1 ? 's' : ''} in JSON format with the following fields:
    - title: A clear, concise title
    - description: A specific, actionable description of what needs to be done
    
    Format the response as a JSON array of objects, each with these fields.
    Example: [{"title": "...", "description": "..."}]`
}

export async function POST(req: Request) {
  try {
    // Validate API key is available and properly formatted
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    if (!OPENAI_API_KEY.startsWith('sk-')) {
      return NextResponse.json(
        { 
          error: "Invalid OpenAI API key format. The key should start with 'sk-'. Please check your environment configuration.",
          details: "Environment variable OPENAI_API_KEY has invalid format"
        },
        { status: 500 }
      )
    }

    const request: AIRequest = await req.json()
    const prompt = generatePrompts[request.type](request.count)

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful assistant that generates user stories, epics, and tasks in JSON format. Always ensure the response is valid JSON and includes all required fields."
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
      })

      const content = completion.choices[0].message.content
      if (!content) {
        throw new Error("No content generated")
      }

      try {
        const parsedContent = JSON.parse(content)
        return NextResponse.json(parsedContent)
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", parseError)
        throw new Error("Invalid response format from OpenAI")
      }
    } catch (openaiError: any) {
      // Handle specific OpenAI API errors
      if (openaiError.response?.status === 401) {
        return NextResponse.json(
          { 
            error: "Invalid OpenAI API key. Please check your environment configuration.",
            details: "API key authentication failed"
          },
          { status: 401 }
        )
      }
      throw openaiError
    }
  } catch (error: any) {
    console.error("OpenAI API error:", error)
    return NextResponse.json(
      { 
        error: error?.message || "Failed to generate content",
        details: error?.response?.data || error?.toString()
      },
      { status: error?.status || 500 }
    )
  }
}
