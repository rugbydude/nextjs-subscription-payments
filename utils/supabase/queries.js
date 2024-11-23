import { supabase } from '../../lib/supabaseClient';

export const createProject = async (name, description) => {
  const { data, error } = await supabase.from('projects').insert([{ name, description }]);
  if (error) throw new Error(error.message);
  return data;
};

export const getProjects = async () => {
  const { data, error } = await supabase.from('projects').select('*');
  if (error) throw new Error(error.message);
  return data;
};

export const createEpic = async (projectId, title, description) => {
  const { data, error } = await supabase.from('epics').insert([{ project_id: projectId, title, description }]);
  if (error) throw new Error(error.message);
  return data;
};

export const createUserStory = async (epicId, title, description, acceptanceCriteria) => {
  const { data, error } = await supabase.from('user_stories').insert([{ epic_id: epicId, title, description, acceptance_criteria: acceptanceCriteria }]);
  if (error) throw new Error(error.message);
  return data;
};

export const createTask = async (userStoryId, title, description) => {
  const { data, error } = await supabase.from('tasks').insert([{ user_story_id: userStoryId, title, description }]);
  if (error) throw new Error(error.message);
  return data;
};
