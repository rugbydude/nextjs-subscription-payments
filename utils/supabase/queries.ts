import { supabase } from '../../lib/supabaseClient';
import type { Project } from '../../types/project';

export const createProject = async (name: string, description: string): Promise<Project[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .insert([{ 
      name, 
      description,
      user_id: user.id
    }])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const getProjects = async (): Promise<Project[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

export const createEpic = async (projectId: string, title: string, description: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Verify project belongs to user
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (!project) throw new Error('Project not found or access denied');

  const { data, error } = await supabase
    .from('epics')
    .insert([{ 
      project_id: projectId, 
      title, 
      description 
    }])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const createUserStory = async (
  epicId: string, 
  title: string, 
  description: string, 
  acceptanceCriteria: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Verify epic belongs to user's project
  const { data: epic } = await supabase
    .from('epics')
    .select('project_id, projects!inner(user_id)')
    .eq('id', epicId)
    .eq('projects.user_id', user.id)
    .single();

  if (!epic) throw new Error('Epic not found or access denied');

  const { data, error } = await supabase
    .from('user_stories')
    .insert([{ 
      epic_id: epicId, 
      title, 
      description, 
      acceptance_criteria: acceptanceCriteria 
    }])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const createTask = async (userStoryId: string, title: string, description: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Verify user story belongs to user's project
  const { data: userStory } = await supabase
    .from('user_stories')
    .select('epic_id, epics!inner(project_id, projects!inner(user_id))')
    .eq('id', userStoryId)
    .eq('epics.projects.user_id', user.id)
    .single();

  if (!userStory) throw new Error('User story not found or access denied');

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ 
      user_story_id: userStoryId, 
      title, 
      description 
    }])
    .select();

  if (error) throw new Error(error.message);
  return data;
};
