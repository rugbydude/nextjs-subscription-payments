import { supabase } from '../../lib/supabaseClient';

export interface Project {
  id: string;
  name: string;
  description: string;
}

export const createProject = async (name: string, description: string) => {
  const { data, error } = await supabase.from('projects').insert([{ name, description }]);
  if (error) throw new Error(error.message);
  return data;
};

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase.from('projects').select('*');
  if (error) throw new Error(error.message);
  return data || [];
};

export const createEpic = async (projectId: string, title: string, description: string) => {
  const { data, error } = await supabase.from('epics').insert([{ project_id: projectId, title, description }]);
  if (error) throw new Error(error.message);
  return data;
};

export const createUserStory = async (epicId: string, title: string, description: string, acceptanceCriteria: string) => {
  const { data, error } = await supabase.from('user_stories').insert([{ epic_id: epicId, title, description, acceptance_criteria: acceptanceCriteria }]);
  if (error) throw new Error(error.message);
  return data;
};

export const createTask = async (userStoryId: string, title: string, description: string) => {
  const { data, error } = await supabase.from('tasks').insert([{ user_story_id: userStoryId, title, description }]);
  if (error) throw new Error(error.message);
  return data;
};
