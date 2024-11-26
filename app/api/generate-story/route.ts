import { NextResponse } from 'next/server';
import { generateUserStory } from '../../../utils/openai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid title is required' },
        { status: 400 }
      );
    }

    // Generate story
    const story = await generateUserStory(title);

    if (!story) {
      throw new Error('Story generation failed');
    }

    // Return success response
    return NextResponse.json({ 
      success: true,
      story,
      message: 'Story generated successfully'
    });

  } catch (error) {
    console.error('Error in generate-story route:', error);
    
    // Return appropriate error response
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate story',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
