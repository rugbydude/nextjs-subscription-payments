// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Project } from '@/types/project';

// Mock data - replace with database calls in production
const projects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with Next.js and Stripe integration',
    progress: 75,
    totalTasks: 24,
    dueDate: '2024-04-01',
    team: [
      { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
      { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      { id: '3', name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
    ],
    status: 'active',
    created_at: '2024-01-01',
    updated_at: '2024-01-15',
  },
  {
    id: '2',
    title: 'Mobile App Redesign',
    description: 'Redesigning the mobile app UI/UX for better user engagement',
    progress: 45,
    totalTasks: 18,
    dueDate: '2024-03-15',
    team: [
      { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      { id: '4', name: 'Sarah Wilson', avatar: '/avatars/sarah.jpg' },
    ],
    status: 'active',
    created_at: '2024-01-05',
    updated_at: '2024-01-10',
  },
];

export async function GET() {
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'team'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new project
    const newProject: Project = {
      id: Date.now().toString(), // Use proper UUID in production
      progress: 0,
      totalTasks: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body,
    };

    // In production, save to database
    projects.push(newProject);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...rest } = body;

  const { data, error } = await supabase
    .from("projects")
    .update(rest)
    .eq("id", id)
    .eq("user_id", session.user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
