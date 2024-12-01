// app/api/stories/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { generateUserStory, generateAcceptanceCriteria, suggestImprovements } from '@/lib/ai/storyGenerator';
import { CreateUserStoryInput, UpdateUserStoryInput } from '@/types/story';

// GET /api/stories - List stories
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');
  const epicId = searchParams.get('epic_id');

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let query = supabase
    .from('stories')
    .select('*, assignee:profiles(*), reporter:profiles(*)')
    .eq('reporter_id', session.user.id);

  if (projectId) {
    query = query.eq('project_id', projectId);
  }

  if (epicId) {
    query = query.eq('epic_id', epicId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/stories - Create story
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const input: CreateUserStoryInput = await request.json();

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

    // Generate AI suggestions
    const aiStory = await generateUserStory(input, {
      projectContext: project ? `${project.title}: ${project.description}` : undefined,
      epicContext: epic ? `${epic.title}: ${epic.description}` : undefined,
      existingStories: existingStories || undefined,
    });

    // Generate acceptance criteria
    const acceptanceCriteria = await generateAcceptanceCriteria({
      ...input,
      ...aiStory,
    });

    // Create the story with AI suggestions
    const { data, error } = await supabase
      .from('stories')
      .insert({
        ...input,
        ...aiStory,
        acceptance_criteria: acceptanceCriteria,
        reporter_id: session.user.id,
        status: 'Draft',
      })
      .select()
      .single();

    if (error) throw error;

    // Generate additional suggestions
    const suggestions = await suggestImprovements(data);

    // Update the story with suggestions
    const { data: updatedStory, error: updateError } = await supabase
      .from('stories')
      .update({ ai_suggestions: suggestions })
      .eq('id', data.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create story' },
      { status: 500 }
    );
  }
}

// PATCH /api/stories - Update story
export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const input: UpdateUserStoryInput = await request.json();

    // Verify story ownership or permissions
    const { data: story } = await supabase
      .from('stories')
      .select('reporter_id')
      .eq('id', input.id)
      .single();

    if (!story || (story.reporter_id !== session.user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the story
    const { data, error } = await supabase
      .from('stories')
      .update(input)
      .eq('id', input.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update story' },
      { status: 500 }
    );
  }
}

// DELETE /api/stories - Delete story
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify story ownership or permissions
    const { data: story } = await supabase
      .from('stories')
      .select('reporter_id')
      .eq('id', id)
      .single();

    if (!story || (story.reporter_id !== session.user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the story
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete story' },
      { status: 500 }
    );
  }
}
