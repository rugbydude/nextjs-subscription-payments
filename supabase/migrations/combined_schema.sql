-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS user_stories;
DROP TABLE IF EXISTS epics;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

-- Create users table first
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger for creating user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create epics table
CREATE TABLE epics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE epics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view epics of their projects" ON epics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = epics.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create epics in their projects" ON epics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = epics.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update epics in their projects" ON epics
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = epics.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete epics in their projects" ON epics
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = epics.project_id AND projects.user_id = auth.uid()
    )
  );

-- Create user stories table
CREATE TABLE user_stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  epic_id UUID REFERENCES epics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  acceptance_criteria TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE user_stories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view stories in their projects" ON user_stories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM epics
      JOIN projects ON projects.id = epics.project_id
      WHERE epics.id = user_stories.epic_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create stories in their projects" ON user_stories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM epics
      JOIN projects ON projects.id = epics.project_id
      WHERE epics.id = user_stories.epic_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update stories in their projects" ON user_stories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM epics
      JOIN projects ON projects.id = epics.project_id
      WHERE epics.id = user_stories.epic_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete stories in their projects" ON user_stories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM epics
      JOIN projects ON projects.id = epics.project_id
      WHERE epics.id = user_stories.epic_id AND projects.user_id = auth.uid()
    )
  );

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_story_id UUID REFERENCES user_stories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'To Do',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view tasks in their projects" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_stories
      JOIN epics ON epics.id = user_stories.epic_id
      JOIN projects ON projects.id = epics.project_id
      WHERE user_stories.id = tasks.user_story_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks in their projects" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_stories
      JOIN epics ON epics.id = user_stories.epic_id
      JOIN projects ON projects.id = epics.project_id
      WHERE user_stories.id = tasks.user_story_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks in their projects" ON tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_stories
      JOIN epics ON epics.id = user_stories.epic_id
      JOIN projects ON projects.id = epics.project_id
      WHERE user_stories.id = tasks.user_story_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks in their projects" ON tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_stories
      JOIN epics ON epics.id = user_stories.epic_id
      JOIN projects ON projects.id = epics.project_id
      WHERE user_stories.id = tasks.user_story_id AND projects.user_id = auth.uid()
    )
  );
