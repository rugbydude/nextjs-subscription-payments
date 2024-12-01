import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { generateUserStory } from '@/lib/ai/storyGenerator';
import { CreateUserStoryInput } from '@/types/story';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const input: Partial<CreateUserStoryInput> = await request.json();

    // Get project context
    const { data: project } = await supabase
      .from('projects')
      .select('title, description')
      .eq('id', input.project_id)
      .single();

    // Get epic context if provided
    let epic;
    if (input.epic_id) {
      const { data } = await supabase
        .from('epics')
        .select('title, description')
        .eq('id', input.epic_id)
        .single();
      epic = data;
    }

    // Get existing stories for context
    const { data: existingStories } = await supabase
      .from('stories')
      .select('title, description')
      .eq('project_id', input.project_id)
      .limit(5);

    // Generate story with AI
    const aiStory = await generateUserStory(input, {
      projectContext: project ? `${project.title}: ${project.description}` : undefined,
      epicContext: epic ? `${epic.title}: ${epic.description}` : undefined,
      existingStories: existingStories || undefined,
    });

    return NextResponse.json(aiStory);
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate story' },
      { status: 500 }
    );
  }
} 